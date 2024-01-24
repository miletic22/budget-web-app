import requests


def make_request(url):
    response = requests.get(url)

    if response.status_code == 200:
        return response.json()
    else:
        print("Request failed with status code:", response.status_code)


def home():
    user_budget = make_request("http://127.0.0.1:5000/budget?user_id=1")
    budget_categories = make_request(
        f"http://127.0.0.1:5000/category?budget_id={user_budget.get('id')}"
    )

    print({"user_budget": user_budget, "budget_categories": budget_categories})


def settings():
    user_budget = make_request("http://127.0.0.1:5000/budget?user_id=1")
    budget_categories = make_request(
        f"http://127.0.0.1:5000/category?budget_id={user_budget.get('id')}"
    )

    print({"user_budget": user_budget, "budget_categories": budget_categories})

    return render_template("index.html", user=current_user)


if __name__ == "__main__":
    home()
