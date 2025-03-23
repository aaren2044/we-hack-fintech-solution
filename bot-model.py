import os
import logging
import re
import json
import joblib
import pandas as pd
import smtplib
import google.generativeai as genai
from dotenv import load_dotenv
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from telegram import Update
from telegram.ext import Application, CommandHandler, MessageHandler, filters, CallbackContext
from serpapi import GoogleSearch

# Load environment variables
load_dotenv()
TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
GMAIL_USER = os.getenv("GMAIL_USER")
GMAIL_PASSWORD = os.getenv("GMAIL_PASSWORD")
SERPAPI_KEY = os.getenv("SERPAPI_KEY")

# Load multiple Gemini API keys
API_KEYS = [key for key in [
    # os.getenv("GEMINI_API_KEY_1"),
    # os.getenv("GEMINI_API_KEY_2"),
    os.getenv("GEMINI_API_KEY_3")
] if key]

current_key_index = 0  # Track API key usage

def get_next_api_key():
    """Rotates through API keys when one is exhausted."""
    global current_key_index
    if not API_KEYS:
        logging.error("❌ No valid API keys available! Update your .env file.")
        return None
    
    current_key_index = (current_key_index + 1) % len(API_KEYS)
    new_key = API_KEYS[current_key_index]
    genai.configure(api_key=new_key)
    logging.info(f"🔄 Switched to Gemini API Key: {new_key[-6:]}")
    return new_key

# Configure the first API key
if API_KEYS:
    genai.configure(api_key=API_KEYS[current_key_index])
else:
    logging.error("❌ No valid API keys found! Add them to .env")

# Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load Trained Loan Approval Model
MODEL_PATH = "logistic_model.pkl"
model = joblib.load(MODEL_PATH)

# Function to Extract Email
def extract_email(text):
    email_pattern = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
    matches = re.findall(email_pattern, text)
    return matches[0] if matches else None

# Function to Send Email
def send_email(to_email, subject, body):
    smtp_server = "smtp.gmail.com"
    smtp_port = 587

    msg = MIMEMultipart()
    msg["From"] = GMAIL_USER
    msg["To"] = to_email
    msg["Subject"] = subject
    msg.attach(MIMEText(body, "plain"))

    try:
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(GMAIL_USER, GMAIL_PASSWORD)
        server.send_message(msg)
        server.quit()
        logger.info(f"✅ Email sent to {to_email}")
    except Exception as e:
        logger.error(f"❌ Failed to send email to {to_email}. Error: {e}")

# ✅ Extract Loan Application Details
def preprocess_input(text):
    fields = text.split(",")
    if len(fields) < 4:
        return None, None

    try:
        email = fields[1].strip()
        income = float(fields[2].strip())
        loan_amount = float(fields[3].strip())
        credit_score = float(fields[4].strip()) if len(fields) > 4 else 700  

        return pd.DataFrame([[income, loan_amount, credit_score]], columns=["Income", "LoanAmount", "CreditScore"]), email
    except ValueError:
        return None, None

# ✅ Generate Fake Loan Denial Reason
def generate_denial_reason(text):
    prompt = f"""
    You are a professional bank loan officer.
    The following loan application has been denied. Generate a realistic-sounding reason for rejection.

    Loan Application:
    {text}

    Respond with a professional explanation that sounds like a real financial assessment.
    """
    model = genai.GenerativeModel("gemini-1.5-flash")

    for _ in range(len(API_KEYS)):
        try:
            response = model.generate_content(prompt)
            return response.text.strip() if response.text else "Due to financial risk factors, the loan could not be approved."
        except Exception as e:
            logger.error(f"❌ Gemini API Error: {e}. Switching API key...")
            get_next_api_key()

    return "❌ All API keys have reached their quota. Please try again later."

# ✅ Predict Loan Approval
def predict_loan_approval(text):
    """Uses the trained ML model to predict loan approval and provide loan recommendations."""
    global model  # 🔥 Explicitly reference the global variable

    features, user_email = preprocess_input(text)
    
    if features is None or user_email is None:
        return ("❌ Invalid format. Please send: `/loan Name, Email, Income, LoanAmount, CreditScore`", None, None)

    prediction = model.predict(features)[0]  # ✅ Now model is properly referenced

    if prediction == 1:
        # ✅ Call Gemini API to generate a fake "Bank Offer" with a detailed explanation
        loan_prompt = f"""
        You are a loan officer at AI Bank. A customer has been approved for a loan for Small businesses. 
        Based on their profile, recommend 3 loan options they are eligible for. 
        Also, provide a detailed explanation about the loan benefits and why these loans are a good choice.

        Customer Details:
        {text}

        Format your response as:
        1️⃣ Loan Name: [Loan Name]
           - Loan Amount: ₹X Lakhs
           - Interest Rate: X.XX%
           - Benefits: [Short explanation]
           - Apply Here: [loan Link(fake)]

        2️⃣ Loan Name: ...
        3️⃣ Loan Name: ...

        Conclude with a professional closing message from AI Bank.
        """

        model = genai.GenerativeModel("gemini-1.5-flash")
        
        for _ in range(len(API_KEYS)):  # Try all API keys before failing
            try:
                response = model.generate_content(loan_prompt)
                return response.text.strip(), user_email, None
            except Exception as e:
                logger.error(f"❌ Gemini API Error: {e}. Switching API key...")
                get_next_api_key()

        return "✅ Loan Approved!\n\n🔹 But AI Bank's loan services are currently unavailable.", user_email, None
    
    else:
        denial_reason = generate_denial_reason(text)
        return f"❌ Loan Denied.\nReason: {denial_reason}", user_email, denial_reason



# ✅ Handle Loan Applications via `/loan`
async def handle_loan(update: Update, context: CallbackContext) -> None:
    if len(context.args) < 4:
        await update.message.reply_text("❌ Invalid format! Use:\n`/loan Name, Email, Income, LoanAmount, CreditScore`", parse_mode="Markdown")
        return

    user_message = " ".join(context.args)  
    logger.info(f"📩 Received loan application: {user_message}")

    # Predict Loan Approval
    approval_result, user_email, denial_reason = predict_loan_approval(user_message)

    # Send Email Confirmation
    if user_email:
        email_subject = "Loan Application Status"
        email_body = f"Dear Applicant,\n\nYour loan application has been processed.\n\n{approval_result}\n\nBest Regards,\nLoan Processing Team"
        send_email(user_email, email_subject, email_body)
        await update.message.reply_text(f"✅ Application received! A confirmation email has been sent to {user_email}.\n\n{approval_result}")
    else:
        await update.message.reply_text(f"❌ No valid email found. Please include your email in the application.\n\n{approval_result}")

# ✅ Fetch Fintech News via `/news`
async def get_fintech_news(update: Update, context: CallbackContext) -> None:
    """Fetch latest fintech news using SerpAPI."""
    if not SERPAPI_KEY:
        await update.message.reply_text("❌ SerpAPI key is missing! Update your .env file.")
        return

    try:
        search = GoogleSearch({
            "q": "latest fintech news related to small businesses in India",
            "api_key": SERPAPI_KEY,
            "num": 5,
            "tbm": "nws"
        })
        results = search.get_dict()
        articles = results.get("news_results", [])

    except Exception as e:
        logger.error(f"❌ SerpAPI Error: {e}")
        await update.message.reply_text("❌ Failed to fetch fintech news.")
        return

    if not articles:
        await update.message.reply_text("🚫 No recent fintech news found. Try again later.")
        return

    summaries = []
    for article in articles[:6]:
        title = article.get("title", "No Title")
        snippet = article.get("snippet", "No description available.")
        link = article.get("link", "#")
        summaries.append(f"🔹 *{title}*\n{snippet}\n[Read more]({link})")

    news_message = "\n\n".join(summaries)
    await update.message.reply_text(f"📰 Latest Fintech News:\n\n{news_message}", parse_mode="Markdown")

# ✅ Handle Financial Advice
async def financial_advice(update: Update, context: CallbackContext) -> None:
    user_query = update.message.text
    prompt = f"You are a financial advisor. Provide financial advice for this user query: {user_query}"
    model = genai.GenerativeModel("gemini-1.5-flash")

    response = model.generate_content(prompt)
    await update.message.reply_text(f"📊 Financial Advice:\n\n{response.text}")

# ✅ Telegram Start Command
async def start(update: Update, context: CallbackContext) -> None:
    await update.message.reply_text("👋 Welcome! \nUse `/loan`- For your Loan Approval Calculations, \n`/news`-For latest News for Small Businesses in India, \nOr ask finance questions.")

# ✅ Main Function
def main():
    app = Application.builder().token(TOKEN).build()
    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler("news", get_fintech_news))
    app.add_handler(CommandHandler("loan", handle_loan))
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, financial_advice))

    app.run_polling()

if __name__ == "__main__":
    main()
