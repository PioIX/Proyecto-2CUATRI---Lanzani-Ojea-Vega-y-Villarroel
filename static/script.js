function iniciarSesion(){
  nombre = document.getElementById("nombreUsuario").value;
  contraseña = document.getElementById("contraseñaUsuario").value;
  $.ajax({
    url:"/verificarInicioSesion",
    type:"POST",
    data: {"nombre":nombre, "contraseña":contraseña},
    success: function(response){
      resultado = JSON.parse(response);
      if (resultado == true){
        document.getElementById("formularioLogin").submit();
      }
      else{
        alert("El nombre o contraseña ingresados son incorrectos");
      }
    },
    error: function(error){
      console.log(error);
    },
  });
}

function coincidirContraseñas(){
  nombreUsuarioRegistro = document.getElementById("nombreUsuarioRegistro").value;
  contraseñaUsuarioRegistro = document.getElementById("contraseñaUsuarioRegistro").value;
  confirmarContraseñaUsuarioRegistro = document.getElementById("confirmarContraseñaUsuarioRegistro").value;
  if (nombreUsuarioRegistro == "" || contraseñaUsuarioRegistro == "" || confirmarContraseñaUsuarioRegistro == ""){
    alert("No se completaron todos los campos")
  }
  else{
    if (contraseñaUsuarioRegistro == confirmarContraseñaUsuarioRegistro){
      document.getElementById("formularioRegistro").submit();
    }
    else{
      alert("Las contraseñas no coinciden");
      document.getElementById("contraseñaUsuario").value = "";
      document.getElementById("confirmarContraseñaUsuario").value = "";
      document.getElementById("contraseñaUsuario").focus();
    }
  }
}

function obtenerNoticias(){
  $.ajax({
    url:"/ajaxObtenerNoticias",
    type:"GET",
    success: function(response){
      noticias = JSON.parse(response);
      for (let i = 0; i < noticias[1]; i ++){
        if (noticias[2] == null || noticias[2] == ""){
          document.getElementById("sectionNoticias").innerHTML += `
            <abbr title="Iniciá sesión para leer la noticia completa" style="text-decoration:transparent">
              <section class="noticia">
                <div class="divTituloNoticias">
                  <h4 class="tituloNoticias" >${noticias[0][i][1]}</h4>
                </div>
                <div class="divContenidoNoticias">
                  <p class="contenidoNoticias">${noticias[0][i][2]}</p>
                </div>
                <div class="divAutoresNoticias">
                  <p class="autoresNoticias">${noticias[0][i][6]}</p>
                </div>
              </section>
            </abbr>
          `;
        }
        else{
          document.getElementById("sectionNoticias").innerHTML += `
            <abbr class="etiquetaLeerNoticia" title="Leer noticia completa">
              <a id="${noticias[0][i][0]}" class="botonDeNoticias" href="noticia/${noticias[0][i][0]}">
                <section class="noticia">
                  <div class="divTituloNoticias">
                    <h4 class="tituloNoticias">${noticias[0][i][1]}</h4>
                  </div>
                  <div class="divContenidoNoticias">
                    <p class="contenidoNoticias">${noticias[0][i][2]}</p>
                  </div>
                  <div class="divAutoresNoticias">
                    <p class="autoresNoticias">${noticias[0][i][6]}</p>
                  </div>
                </section>
              </a>
            </abbr>
          `;
        }
      }
    },
    error: function(error){
      console.log(error);
    },
  });
}

function agregarNuevaNoticia(){
  categoria = document.getElementById("categoria").value;
  titulo = document.getElementById("titulo").textContent;
  contenido = document.getElementById("contenido").textContent;
  autor = document.getElementById("autor").value;
  $.ajax({
    url:"/agregarNuevaNoticia",
    type:"POST",
    data: {"categoria":categoria, "titulo":titulo, "contenido":contenido, "autor":autor},
    success: function(response){
      resultado = JSON.parse(response);
      if (resultado == true){
        document.getElementById("formNuevaNoticia").submit();
      }
    },
    error: function(error){
      console.log(error);
    },
  });
}

function seleccionarFuncionEliminar(){
  htmlDivHome = document.getElementById("navBase").innerHTML;
  document.getElementById("navBase").innerHTML = "";
  htmlHomeSinModificar = document.getElementById("divHome").innerHTML;
  document.getElementById("botonNuevaNoticia").outerHTML = "";
  document.getElementById("botonEditarNoticia").outerHTML = "";
  document.getElementById("botonEliminarNoticia").outerHTML = `
    <a id="botonEliminarNoticia" onclick="cancelarEliminarNoticia()">Cancelar</a>
  `;
  document.getElementById("tituloAdmin").outerHTML = `
    <h3 id="alertaEliminarNoticia">Seleccioná la noticia que quieras eliminar</h3>
  `;
  for (let x = 0; x < document.getElementsByClassName("botonDeNoticias").length; x ++){
    document.getElementsByClassName("etiquetaLeerNoticia")[x].setAttribute('title', 'Hacé click para eliminar esta noticia')
    document.getElementsByClassName("botonDeNoticias")[x].removeAttribute('href');
    document.getElementsByClassName("botonDeNoticias")[x].setAttribute('onclick', `eliminarNoticia(${document.getElementsByClassName("botonDeNoticias")[x].getAttribute("id")})`);
    document.getElementById("alertaEliminarNoticia").setAttribute('style', 'border: 2px solid red; color: red;');
  }
  document.getElementById("etiquetaStyleHome").innerHTML = `
    .noticia:hover h4, .noticia:hover h6, .noticia:hover p{
      color: red;
    }
    .noticia:hover{
      border: 2px solid red;
    }
  `;
}

function cancelarEliminarNoticia(){
  document.getElementById("navBase").innerHTML = htmlDivHome;
  document.getElementById("divHome").innerHTML = htmlHomeSinModificar;
  document.getElementById("etiquetaStyleHome").innerHTML = "";
}

function eliminarNoticia(idPregunta){
  $.ajax({ 
    url:"/eliminarNoticia", 
    type:"DELETE", 
    data: {"idPregunta":idPregunta},
    success: function(response){
      datos = JSON.parse(response);
      location.reload();
    },
    error: function(error){ 
      console.log(error);
    }, 
  });
}

function mostrarComentarios(){
  if (document.getElementById("comentarios").innerHTML == ""){ 
    document.getElementById("comentarios").innerHTML = `
      <h4>Dejá acá tus comentarios:</h4>
      <input type="text" placeholder="Escriba aquí..." required autofocus>
    `;
  }
  else{
    document.getElementById("comentarios").innerHTML = "";
  }
}

function darLike(idNoticia, idUsuario){
  document.getElementById("boxIconCorazoncito").setAttribute('type', 'solid');
  document.getElementById("boxIconCorazoncito").setAttribute('color', 'red');
  document.getElementById("labelLikes").innerHTML = parseInt(document.getElementById("labelLikes").innerHTML) + 1;
  gestionLikes(parseInt(document.getElementById("labelLikes").innerHTML), idNoticia, idUsuario);
  document.getElementById("corazoncito").setAttribute('onclick', `sacarLike(${idNoticia}, ${idUsuario})`);
}

function sacarLike(idNoticia, idUsuario){
  document.getElementById("boxIconCorazoncito").setAttribute('type', 'regular');
  document.getElementById("boxIconCorazoncito").setAttribute('color', 'white');
  document.getElementById("labelLikes").innerHTML = parseInt(document.getElementById("labelLikes").innerHTML) - 1;
  gestionLikes(parseInt(document.getElementById("labelLikes").innerHTML), idNoticia, idUsuario)
  document.getElementById("corazoncito").setAttribute('onclick', `darLike(${idNoticia}, ${idUsuario})`);
}

function gestionLikes(cantidadLikes, idNoticia, idUsuario){
  cantidadLikes = cantidadLikes;
  idNoticia = idNoticia;
  idUsuario = idUsuario;
  $.ajax({ 
    url:"/ajaxGestionLikes", 
    type:"PUT", 
    data: {"cantidadLikes":cantidadLikes, "idNoticia":idNoticia},
    success: function(response){
      datos = JSON.parse(response);
    },
    error: function(error){ 
      console.log(error);
    }, 
  });
  $.ajax({ 
    url:"/ajaxGestionLikes", 
    type:"POST",
    data: {"idNoticia":idNoticia, "idUsuario":idUsuario},
    success: function(response){
      datos = JSON.parse(response);
    },
    error: function(error){ 
      console.log(error);
    }, 
  });
}

function verificarNoticiaLikeada(idUsuario, idNoticia){
  idUsuario = parseInt(idUsuario);
  idNoticia = parseInt(idNoticia);
  $.ajax({ 
    url:"/verificarNoticiaLikeada", 
    type:"POST",
    data: {"idUsuario":idUsuario, "idNoticia":idNoticia},
    success: function(response){
      datos = JSON.parse(response);
      if (datos == true){
        document.getElementById("boxIconCorazoncito").setAttribute('type', 'solid');
        document.getElementById("boxIconCorazoncito").setAttribute('color', 'red');
        document.getElementById("corazoncito").setAttribute('onclick', `sacarLike(${idNoticia}, ${idUsuario})`);
      }
      else{
        document.getElementById("boxIconCorazoncito").setAttribute('type', 'regular');
        document.getElementById("boxIconCorazoncito").setAttribute('color', 'white');
        document.getElementById("corazoncito").setAttribute('onclick', `darLike(${idNoticia}, ${idUsuario})`);
      }
    },
    error: function(error){ 
      console.log(error);
    }, 
  }); 
}