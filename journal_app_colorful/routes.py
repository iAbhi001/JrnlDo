from flask import render_template, redirect, url_for, request, jsonify
from app import app, db
from models import User, Journal
from flask_login import login_user, logout_user, login_required, current_user

# Signup route
@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    # Check if the user already exists
    if User.query.filter_by(username=username).first():
        return jsonify({"success": False, "message": "User already exists"})

    # Create a new user
    user = User(username=username)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()
    return jsonify({"success": True})

# Signin route
@app.route('/signin', methods=['POST'])
def signin():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    user = User.query.filter_by(username=username).first()

    # Check if the user exists and the password matches
    if user and user.check_password(password):
        login_user(user)
        return jsonify({"success": True})
    return jsonify({"success": False, "message": "Invalid credentials"})

# Add a new journal entry
@app.route('/journal', methods=['POST'])
@login_required  # Ensure the user is logged in
def add_journal():
    data = request.get_json()
    title = data.get('title')
    content = data.get('content')

    # Create a new journal entry for the logged-in user
    new_entry = Journal(title=title, content=content, user_id=current_user.id)
    db.session.add(new_entry)
    db.session.commit()
    return jsonify({"success": True})

# Get all journal entries for the current user
@app.route('/journal', methods=['GET'])
@login_required  # Ensure the user is logged in
def get_journals():
    # Query all journal entries for the logged-in user
    entries = Journal.query.filter_by(user_id=current_user.id).all()

    # Prepare a response in JSON format
    entries_data = [{"id": entry.id, "title": entry.title, "content": entry.content} for entry in entries]
    return jsonify({"entries": entries_data})

# Delete a journal entry
@app.route('/journal/<int:entry_id>', methods=['DELETE'])
@login_required  # Ensure the user is logged in
def delete_journal(entry_id):
    entry = Journal.query.get(entry_id)

    # Check if the entry exists and belongs to the current user
    if entry and entry.user_id == current_user.id:
        db.session.delete(entry)
        db.session.commit()
        return jsonify({"success": True})
    return jsonify({"success": False, "message": "Entry not found or unauthorized"})
