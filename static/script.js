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