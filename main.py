from flask import Flask, render_template, request, redirect, session, jsonify, url_for
import sqlite3
import json
import datetime

app = Flask(__name__)
app.secret_key = 'heladeracaliente123'


cantidadDeNoticias = 24

def obtenerNoticias():
  conn = sqlite3.connect('baseDeDatos.db')
  resu = conn.execute(f"""SELECT * FROM Noticias""")
  listaNoticias = []
  for linea in resu:
    listaNoticias.append(linea)
  conn.close()
  return listaNoticias

def obtenerUsuarios():
  conn = sqlite3.connect('baseDeDatos.db')
  resu = conn.execute(f"""SELECT * FROM Usuarios""")
  listaUsuarios = []
  for linea in resu:
    listaUsuarios.append(linea)
  conn.close()
  return listaUsuarios

@app.route('/')
def index():
  return render_template('index.html', navActive = 1)

@app.route('/home', methods=["GET", "POST"])
def home():
  return render_template('home.html', navActive = 2)

@app.route('/ajaxObtenerNoticias', methods=["GET", "POST"])
def ajaxObtenerNoticias():
  if request.method == "GET":
    noticias = obtenerNoticias()
    try: 
      session['nombre']
    except: 
      session['nombre'] = 'null'
    return json.dumps([noticias, cantidadDeNoticias, session['nombre']])
  else:
   return render_template("home.html", navActive = 2)   

@app.route('/buscar')
def buscar():
  return render_template('buscar.html', navActive = 3)

@app.route('/iniciarSesion')
def iniciarSesion():
  return render_template('iniciarSesion.html', navActive = 4)

@app.route('/verificarInicioSesion', methods=["POST"])
def verificarInicioSesion():
  if request.method == "POST":
    nombre = request.form["nombre"]
    contraseña = request.form["contraseña"]
    conn = sqlite3.connect('baseDeDatos.db')
    resu = conn.execute(f"""SELECT id FROM Usuarios WHERE nombre = '{nombre}' AND contraseña = '{contraseña}'""")
    if resu.fetchone():
      conn.close()
      session['nombre'] = nombre
      session['contraseña'] = contraseña
      return json.dumps(True)
    else:
      conn.close()
      return json.dumps(False)
  else:
    return render_template('iniciarSesion.html')

@app.route('/registro/<int:mensaje>')
def registro(mensaje):
  return render_template("registro.html", navActive = 0, mensaje = mensaje)

@app.route('/verificarRegistro', methods=["GET", "POST"])
def verificarRegistro():
  if request.method == "POST":
    nombre = request.form["nomUsuario"]
    contraseña = request.form["conUsuario"]
    confirmacionContraseña = request.form["confirmarConUsuario"]
    carrera = request.form["carreraUsuario"]
    conn = sqlite3.connect('baseDeDatos.db')
    resu = conn.execute(f"""SELECT id FROM Usuarios WHERE nombre = '{nombre}'""")
    if resu.fetchone():
      conn.close()
      return redirect(url_for('registro', mensaje = 1))
    else:
      if contraseña == confirmacionContraseña:
        resu = conn.execute(f"""INSERT INTO Usuarios (nombre, contraseña, carrera) VALUES ('{nombre}', '{contraseña}', '{carrera}')""")
        conn.commit()
        conn.close()
        return redirect('/')
      else:
        conn.commit()
        conn.close()
  else:
    return render_template('registro.html')

@app.route('/cerrarSesion')
def cerrarSesion():
  session['nombre'] = ""
  session['contraseña'] = ""
  return redirect('/')

@app.route('/creadorDeNoticias', methods=["GET", "POST"])
def creadorDeNoticias():
  if session['nombre'] == "admin":
    return render_template('creadorDeNoticias.html')
  else:
    return redirect('/')

@app.route('/agregarNuevaNoticia', methods=["GET", "POST"])
def agregarNuevaNoticia():
  if request.method == "POST":
    categoria = request.form["categoria"]
    titulo = request.form["titulo"]
    contenido = request.form["contenido"]
    autor = request.form["autor"]
    tiempoActual = datetime.datetime.now()
    conn = sqlite3.connect('baseDeDatos.db')
    conn.execute(f"""INSERT INTO Noticias (titulo, contenido, likes, fecha, categoria, autor) VALUES ('{titulo}', '{contenido}', 0, '{tiempoActual}', '{categoria}', '{autor}')""")
    conn.commit()
    conn.close()
    global cantidadDeNoticias
    cantidadDeNoticias += 1
    return json.dumps(True)
  else:
    return render_template('creadorDeNoticias.html')

@app.route('/noticia/<int:idNoticia>', methods=["GET", "POST"])
def noticia(idNoticia):
  for i in obtenerNoticias():
    if i[0] == idNoticia:
      noticia = i
  conn = sqlite3.connect("baseDeDatos.db")
  idUsuario = conn.execute(f"""SELECT id FROM Usuarios WHERE nombre = '{session['nombre']}'""")
  id = 0
  for i in idUsuario:
    id = i[0]
  return render_template('noticia.html', navActive = 5, noticia = noticia, idUsuario = id)

@app.route('/eliminarNoticia', methods=["DELETE"])
def eliminarNoticia():
  if request.method== "DELETE":
    idPregunta = request.form["idPregunta"]
    conn = sqlite3.connect('baseDeDatos.db')
    conn.execute(f"""DELETE FROM Noticias WHERE id = {idPregunta}""")
    conn.commit()
    conn.close()
    return json.dumps(True)
  else:
    return redirect("/home")

@app.route('/eliminarComentario', methods=["DELETE"])
def eliminarComentario():
  if request.method== "DELETE":
    idComentario = request.form["idComentario"]
    conn = sqlite3.connect('baseDeDatos.db')
    conn.execute(f"""DELETE FROM Comentarios WHERE id = {idComentario}""")
    conn.commit()
    conn.close()
    return json.dumps(True)
  else:
    return redirect("/home")

@app.route('/ajaxGestionLikes', methods=["GET", "POST", "PUT"])
def ajaxGestionLikes():
  if request.method == "PUT":
    cantidadLikes = request.form["cantidadLikes"]
    idNoticia = request.form["idNoticia"]
    conn = sqlite3.connect('baseDeDatos.db')
    conn.execute(f"""UPDATE Noticias SET likes = {cantidadLikes} WHERE id = {idNoticia}""")
    conn.commit()
    conn.close()
    return json.dumps(True)
  elif request.method == "POST":
    idNoticia = request.form["idNoticia"]
    idUsuario = request.form["idUsuario"]
    conn = sqlite3.connect('baseDeDatos.db')
    resu = conn.execute(f"""SELECT * FROM UsuariosLikes WHERE idUsuario = {idUsuario} AND idNoticia = {idNoticia}""")
    if resu.fetchone():
      conn.execute(f"""DELETE FROM UsuariosLikes WHERE idUsuario = {idUsuario} AND idNoticia = {idNoticia}""")
      conn.commit()
      conn.close()
    else:
      conn.execute(f"""INSERT INTO UsuariosLikes (idUsuario, idNoticia) VALUES ({idUsuario}, {idNoticia})""")
      conn.commit()
      conn.close()
    return json.dumps(True)
  else:
    return render_template("noticia.html")

@app.route('/verificarNoticiaLikeada', methods=["GET", "POST"])
def verificarNoticiaLikeada():
  if request.method == "POST":
    idUsuario = request.form["idUsuario"]
    idNoticia = request.form["idNoticia"]
    conn = sqlite3.connect("baseDeDatos.db")
    resu = conn.execute(f"""SELECT * FROM UsuariosLikes WHERE idUsuario = {idUsuario} AND idNoticia = {idNoticia}""")
    if resu.fetchone():
      conn.close()
      return json.dumps(True)
    else:
      conn.close()
      return json.dumps(False)
  else:
    return render_template("noticia.html")

@app.route('/editorDeNoticias/<int:idNoticia>', methods=["GET", "POST"])
def editorDeNoticias(idNoticia):
  if session['nombre'] == "admin":
    return render_template('editorDeNoticias.html', navActive = 5, idNoticia = idNoticia)
  else:
    return redirect('/')

@app.route('/ajaxPrepararDatosParaEditar', methods=["GET", "POST"])
def ajaxPrepararDatosParaEditar():
  if request.method == "POST":
    idNoticia = request.form["idNoticia"]
    conn = sqlite3.connect('baseDeDatos.db')
    resu = conn.execute(f"""SELECT * FROM Noticias WHERE id = {idNoticia}""")
    noticia = []
    for linea in resu:
      noticia.append(linea)
    conn.close()
    return json.dumps(noticia)
  else:
    return render_template("editorDeNoticias.html")

@app.route('/guardarNoticiaEditada', methods=["GET", "POST"])
def guardarNoticiaEditada():
  if request.method == "POST":
    idNoticia = request.form["idNoticia"]
    categoria = request.form["categoria"]
    titulo = request.form["titulo"]
    contenido = request.form["contenido"]
    autor = request.form["autor"]
    conn = sqlite3.connect('baseDeDatos.db')
    conn.execute(f"""UPDATE Noticias SET titulo = '{titulo}', contenido = '{contenido}', categoria = '{categoria}', autor = '{autor}' WHERE id = {idNoticia}""")
    conn.commit()
    conn.close()
    return json.dumps(True)
  else:
    return render_template('editorDeNoticias.html')

@app.route('/agregarComentario', methods=["GET", "POST"])
def agregarComentario():
  if request.method == "POST":
    idUsuario = request.form["idUsuario"]
    idNoticia = request.form["idNoticia"]
    texto = request.form["texto"]
    conn = sqlite3.connect('baseDeDatos.db')
    conn.execute(f"""INSERT INTO Comentarios (noticiaCorrespondiente, texto, likesComentario, usuarioCorrespondiente) VALUES ({idNoticia}, '{texto}', 0, {idUsuario})""")
    conn.commit()
    conn.close()
    return json.dumps(True)
  else:
    return render_template('noticia.html')

@app.route('/obtenerComentariosNoticia', methods=["GET", "POST"])
def obtenerComentariosNoticia():
  if request.method == "POST":
    idNoticia = request.form["idNoticia"]
    conn = sqlite3.connect('baseDeDatos.db')
    resu = conn.execute(f"""SELECT * FROM Comentarios WHERE noticiaCorrespondiente = {idNoticia}""")
    comentarios = []
    for linea in resu:
      comentarios.append(linea)
    conn.close()
    usuarios = obtenerUsuarios()
    return json.dumps([comentarios, usuarios])
  else:
    return render_template('noticia.html')

@app.route('/buscarNoticias', methods=["GET", "POST"])
def buscarNoticias():
  if request.method == "POST":
    textoBuscar = request.form["textoBuscar"]
    conn = sqlite3.connect('baseDeDatos.db')
    resu = conn.execute(f"""SELECT * FROM Noticias WHERE titulo LIKE '%{textoBuscar}%'""")
    noticiasEncontradas = []
    for linea in resu:
      noticiasEncontradas.append(linea)
    resu = conn.execute(f"""SELECT * FROM Noticias WHERE contenido LIKE '%{textoBuscar}%'""")
    for linea in resu:
      if linea not in noticiasEncontradas:
        noticiasEncontradas.append(linea)
    resu = conn.execute(f"""SELECT * FROM Noticias WHERE autor LIKE '%{textoBuscar}%'""")
    for linea in resu:
      if linea not in noticiasEncontradas:
        noticiasEncontradas.append(linea)
    try: 
      session['nombre']
    except: 
      session['nombre'] = 'null'
    return json.dumps([noticiasEncontradas, cantidadDeNoticias, session['nombre']])
  else:
    return render_template('buscar.html')


app.run(host='0.0.0.0', port=81)