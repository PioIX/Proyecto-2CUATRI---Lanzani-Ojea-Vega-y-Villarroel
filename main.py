from flask import Flask, render_template, request, redirect, session, jsonify
import sqlite3
import json

app = Flask(__name__)
app.secret_key = 'heladeracaliente123'

@app.route('/')
def index():
    return render_template('index.html', navActive = 1)

@app.route('/home')
def home():
  return render_template('home.html', navActive = 2)

@app.route('/buscar')
def buscar():
    return render_template('buscar.html', navActive = 3)

@app.route('/iniciarSesion')
def iniciarSesion():
    return render_template('iniciarSesion.html', navActive = 4)

@app.route('/verificarInicioSesion', methods=["POST"])
def verificarInicioSesion():
  if request.method == "POST":
    session['nombre'] = request.form["nombre"]
    session['contraseña'] = request.form["contraseña"]
    conn = sqlite3.connect('baseDeDatos.db')
    resu = conn.execute(f"""SELECT id FROM Usuarios WHERE nombre = '{session['nombre']}' AND contraseña = '{session['contraseña']}'""")
    if resu.fetchone():
      conn.close()
      return json.dumps(True)
    else:
      conn.close()
      return json.dumps(False)
  else:
    return render_template('iniciarSesion.html')

@app.route('/registro')
def registro():
  return render_template("registro.html")

@app.route('/verificarRegistro', methods=["GET", "POST"])
def verificarRegistro():
  if request.method == "POST":
    nombre = request.form["nomUsuario"]
    contraseña = request.form["conUsuario"]
    carrera = request.form["carreraUsuario"]
    conn = sqlite3.connect('baseDeDatos.db')
    resu = conn.execute(f"""SELECT id FROM Usuarios WHERE nombre = '{nombre}'""")
    if resu.fetchone():
      conn.close()
      print("El nombre ya fue tomado por otro usuario")
      return redirect('/registro')
    else:
      resu = conn.execute(f"""INSERT INTO Usuarios (nombre, contraseña, carrera) VALUES ('{nombre}', '{contraseña}', '{carrera}')""")
      conn.commit()
      conn.close()
      return redirect('/')
  else:
    return render_template('registro.html')


app.run(host='0.0.0.0', port=81)
