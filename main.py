from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium import webdriver
import time
from bs4 import BeautifulSoup
import json
import re
from selenium.webdriver.common.keys import Keys

# Function to select browser driver
def select_browser(browser_type):
    if browser_type == 1:
        return webdriver.Chrome()
    elif browser_type == 2:
        return webdriver.Edge()
    elif browser_type == 3:
        return webdriver.Firefox()
    elif browser_type == 4:
        return webdriver.Ie()
    elif browser_type == 5:
        return webdriver.Safari()
    else:
        raise ValueError("Invalid browser type. Please enter a number between 1 and 5.")

# Get user inputs
browser_type = int(input("Please enter an integer 1-5 for which browser you'd like to use\n(you need to download the corresponding webdriver):\n1: Chrome\n2: Edge\n3: FireFox\n4: Internet Explorer\n5: Safari\n"))
print("Please enter Conjuguemos login")
username = input("Username: ")
password = input("Password: ")
vocab_id = input("What is the ID of the lesson?\n")
wait_time = input("How much time do you want the bot to wait in between questions?\n")

try:
    driver = select_browser(browser_type)

    # Navigate to the login page
    driver.get("https://conjuguemos.com/auth/login")

    # Wait for the cookie acceptance button to be present and then click it
    cookie_button = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.CLASS_NAME, "js-cookie-confirm-close"))
    )
    cookie_button.click()
    print("Found and clicked cookie accept button element")

    # Wait for the username field to be present and then send keys to it
    username_field = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.ID, "identity"))
    )
    username_field.click()
    username_field.send_keys(username)
    print("Found username field and entered text")

    # Wait for the password field to be present and then send keys to it
    password_field = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.ID, "password"))
    )
    password_field.click()
    password_field.send_keys(password)
    print("Found password field and entered text")

    # Wait for the login button to be present and then click it
    login_button = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.ID, "login_btn"))
    )
    login_button.click()

    # Wait for the login to complete
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.CLASS_NAME, "active"))
    )

    # Navigate to the vocabulary list page
    driver.get(f'https://conjuguemos.com/vocabulary/vocab_chart/{vocab_id}')
    time.sleep(0.5)
    
    # Get the page source (HTML)
    page_source = driver.page_source

    # Parse the HTML with BeautifulSoup
    soup = BeautifulSoup(page_source, 'html.parser')

    # Find the vocabulary list table
    table = soup.find('table', class_='table table--fat')

    # Extract the vocabulary list
    vocab_list = []
    for row in table.find_all('tr')[1:]:  # Skip the header row
        columns = row.find_all('td')
        if len(columns) == 2:
            prompt = columns[0].text.strip()
            # Remove numbers from the prompt
            prompt = re.sub(r'^\d+\.\s*', '', prompt)
            answer = columns[1].text.strip()
            # Remove numbers from the answer
            answer = re.sub(r'^\d+\.\s*', '', answer)
            if "/" in answer:
                answer = answer.split("/")[0]
            vocab_list.append({"Prompt": prompt, "Answer": answer})

    # Convert the vocabulary list to JSON
    vocab_json = json.dumps(vocab_list, ensure_ascii=False, indent=2)

    # Navigate to the homework page
    driver.get(f'https://conjuguemos.com/vocabulary/homework/{vocab_id}')

    # Wait for the start button to be clickable and then click it
    start_button = WebDriverWait(driver, 20).until(
        EC.element_to_be_clickable((By.CLASS_NAME, "btn--start-gp"))
    )
    start_button.click()

    time.sleep(1)

    while True:
        try:
            # Wait for the question input field to be present
            question_input = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.ID, "question-input"))
            )

            # Get the text of the question
            question_text = question_input.text.strip()

            print(f'Question text: {question_text}')

            # Find the corresponding answer from vocab_list
            answer = None
            for item in vocab_list:
                if item["Prompt"] == question_text:
                    answer = item["Answer"]
                    break

            if answer:
                print(f"Question: {question_text}")
                print(f"Answer: {answer}")
            else:
                print(f"No answer found for question: {question_text}")
                break

            # Wait for the answer field to be present and then send keys to it
            answer_field = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.ID, "answer-input"))
            )
            answer_field.click()
            answer_field.send_keys(answer)
            answer_field.send_keys(Keys.RETURN)

            time.sleep(float(wait_time))  # Adjust sleep time as necessary

        except Exception as e:
            print(f"Error: {e}")
            break

finally:
    while True:
        continue
