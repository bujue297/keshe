from flask import Flask, render_template, jsonify, request
import sqlite3

app = Flask(__name__)

# 初始化数据库
def init_db():
    conn = sqlite3.connect('game.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS scores
                 (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, score INTEGER, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)''')
    conn.commit()
    conn.close()

init_db()

@app.route('/')
def home():
    return render_template('index.html')  # 渲染 index.html 页面

@app