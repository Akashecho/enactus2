import os
import datetime
from flask import Flask, render_template, request, redirect, url_for, flash, session
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.secret_key = 'super_secret_key_for_flash_messages'

# --- DATABASE CONFIGURATION ---
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'enactus.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# --- MODELS ---
class Event(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    date_day = db.Column(db.String(10), nullable=False) 
    date_month = db.Column(db.String(10), nullable=False) 
    short_desc = db.Column(db.String(200), nullable=False)
    full_desc = db.Column(db.Text, nullable=False)
    image_url = db.Column(db.String(500), nullable=False)
    is_open = db.Column(db.Boolean, default=True)
    # New fields for event duration
    start_date = db.Column(db.String(20), nullable=True)  # Format: YYYY-MM-DD
    end_date = db.Column(db.String(20), nullable=True)    # Format: YYYY-MM-DD
    event_time = db.Column(db.String(20), nullable=True)  # Format: HH:MM
    venue = db.Column(db.String(200), nullable=True)
    max_registrations = db.Column(db.Integer, nullable=True)

class Registration(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    event_id = db.Column(db.Integer, db.ForeignKey('event.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    student_id = db.Column(db.String(50), nullable=False)
    event = db.relationship('Event', backref='registrations')

# --- PUBLIC ROUTES ---
@app.route('/')
def home(): return render_template('home.html', title="Home")

@app.route('/projects')
def projects(): return render_template('projects.html', title="Our Work")

@app.route('/project/navodaya')
def project_navodaya(): return render_template('project_navodaya.html', title="Project Navodaya")

@app.route('/project/astitva')
def project_astitva(): return render_template('project_astitva.html', title="Project Astitva")

@app.route('/project/vriksh')
def project_vriksh(): return render_template('project_vriksh.html', title="Project Vriksh")

@app.route('/team')
def team(): return render_template('team.html', title="Our Team")

@app.route('/about')
def about(): return render_template('about.html', title="About Us")

@app.route('/store')
def store(): return render_template('store.html', title="Store")

@app.route('/events')
def events():
    all_events = Event.query.all()
    return render_template('events.html', events=all_events, title="Events")

@app.route('/register_event', methods=['POST'])
def register_event():
    event_id = request.form.get('event_id')
    name = request.form.get('name')
    email = request.form.get('email')
    student_id = request.form.get('student_id')

    if not name or not email:
        flash("Please fill in all fields.", "error")
        return redirect(url_for('events'))

    try:
        new_reg = Registration(event_id=event_id, name=name, email=email, student_id=student_id)
        db.session.add(new_reg)
        db.session.commit()
        flash(f"Success! {name}, you are registered.", "success")
    except Exception as e:
        db.session.rollback()
        flash("Something went wrong.", "error")

    return redirect(url_for('events'))

# --- ADMIN ROUTES (SECURE) ---

@app.route('/admin_login', methods=['GET', 'POST'])
def admin_login():
    if request.method == 'POST':
        password = request.form.get('password')
        # Simple Password Check
        if password == 'enactus_adgips':
            session['is_admin'] = True
            flash("Welcome back, Admin.", "success")
            return redirect(url_for('admin'))
        else:
            flash("Invalid Password.", "error")
            return redirect(url_for('admin_login'))
            
    return render_template('admin_login.html', title="Admin Login")

@app.route('/admin')
def admin():
    # Security Check
    if not session.get('is_admin'):
        return redirect(url_for('admin_login'))

    regs = Registration.query.all()
    events = Event.query.all()
    return render_template('admin.html', regs=regs, events=events, title="Admin Dashboard")

@app.route('/add_event', methods=['POST'])
def add_event():
    if not session.get('is_admin'):
        return redirect(url_for('admin_login'))

    title = request.form.get('title')
    date_str = request.form.get('date') # Returns YYYY-MM-DD
    short_desc = request.form.get('short_desc')
    full_desc = request.form.get('full_desc')
    image_url = request.form.get('image_url')
    # New optional fields
    event_time = request.form.get('time')
    venue = request.form.get('venue')
    max_reg = request.form.get('max_registrations')

    # Convert Date (2024-11-25) -> Day (25) Month (NOV)
    try:
        date_obj = datetime.datetime.strptime(date_str, '%Y-%m-%d')
        day = date_obj.strftime("%d")
        month = date_obj.strftime("%b").upper() # "NOV"

        new_event = Event(
            title=title,
            date_day=day,
            date_month=month,
            short_desc=short_desc,
            full_desc=full_desc,
            image_url=image_url,
            is_open=True,
            start_date=date_str,
            event_time=event_time if event_time else None,
            venue=venue if venue else None,
            max_registrations=int(max_reg) if max_reg else None
        )
        db.session.add(new_event)
        db.session.commit()
        flash("New Event Published Successfully!", "success")
    except Exception as e:
        print(e)
        flash("Error creating event. Check date format.", "error")

    return redirect(url_for('admin'))

@app.route('/toggle_event/<int:event_id>', methods=['POST'])
def toggle_event(event_id):
    if not session.get('is_admin'):
        return redirect(url_for('admin_login'))
    
    event = Event.query.get_or_404(event_id)
    event.is_open = not event.is_open
    db.session.commit()
    
    status = "opened" if event.is_open else "closed"
    flash(f"Registration for '{event.title}' has been {status}.", "success")
    return redirect(url_for('admin'))

@app.route('/delete_event/<int:event_id>', methods=['POST'])
def delete_event(event_id):
    if not session.get('is_admin'):
        return redirect(url_for('admin_login'))
    
    event = Event.query.get_or_404(event_id)
    event_title = event.title
    
    # Delete all registrations for this event first
    Registration.query.filter_by(event_id=event_id).delete()
    
    db.session.delete(event)
    db.session.commit()
    
    flash(f"Event '{event_title}' and all its registrations have been deleted.", "success")
    return redirect(url_for('admin'))

@app.route('/delete_registration/<int:reg_id>', methods=['POST'])
def delete_registration(reg_id):
    if not session.get('is_admin'):
        return redirect(url_for('admin_login'))
    
    registration = Registration.query.get_or_404(reg_id)
    reg_name = registration.name
    
    db.session.delete(registration)
    db.session.commit()
    
    flash(f"Registration for '{reg_name}' has been deleted.", "success")
    return redirect(url_for('admin'))

@app.route('/logout')
def logout():
    session.pop('is_admin', None)
    flash("Logged out successfully.", "success")
    return redirect(url_for('home'))

# --- SEED DATA ---
def seed_database():
    with app.app_context():
        db.create_all()
        if Event.query.count() == 0:
            e1 = Event(
                title="Social Entrepreneurship Summit",
                date_day="12", date_month="NOV",
                short_desc="Leading the future of social impact.",
                full_desc="Join industry giants for a masterclass.",
                image_url="https://images.unsplash.com/photo-1544531586-fde5298cdd40?w=800",
                is_open=True
            )
            db.session.add(e1)
            db.session.commit()

if __name__ == '__main__':
    seed_database()
    app.run(host='0.0.0.0',port=5000)
