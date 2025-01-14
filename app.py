from flask import Flask, render_template, jsonify, request

app = Flask(__name__)

# 模拟数据库
history = []

@app.route('/')
def home():
    return render_template('index.html')  # 渲染 index.html 页面

@app.route('/save_score', methods=['POST'])
def save_score():
    data = request.json
    history.append(data)
    return jsonify({"message": "得分保存成功！"}), 200

@app.route('/get_history', methods=['GET'])
def get_history():
    return jsonify(history), 200

if __name__ == '__main__':
    app.run(debug=True)
