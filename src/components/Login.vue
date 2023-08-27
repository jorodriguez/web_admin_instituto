<template>
  <div class="login  " >
    <section class="section section-shaped section-lg" >
      <!--  bg-gradient-default-->
      <div class="shape shape-style-1 pb-4 ">
        <div class="container pt-lg-7">
          <div class="row justify-content-center">
            <div class="col-lg-5">
              <div class="card shadow border-1">
                <div class="card-header  responsive text-center">
                  <!--<img src="https://res.cloudinary.com/dwttlkcmu/image/upload/v1640639519/static/thumbnail_LOGO_PARIS_aw1o2o.png" height="80" width="140" />-->
                  <h1 style="font-size:2em" class="responsive">
                    Soft<span>lineas</span>
                  </h1>
                  <small class="text-gray">Ayudamos en tu crecimiento</small>
                </div>
                <div class="card-body px-lg-5 py-lg-5">
                  <form role="form">
                    <div class="form-group mb-3">
                      <!--<div class="input-group input-group-alternative">-->
                      <div class="input-group input-group">
                        <div class="input-group-prepend">
                          <span class="input-group-text">
                            @
                          </span>
                        </div>
                        <input
                          type="email"
                          v-model="input.correo"
                          class="form-control"
                          placeholder="Correo"
                          v-on:keyup.enter="login()"
                          required
                          autofocus
                        />
                      </div>
                    </div>
                    <div class="form-group">
                      <div class="input-group input-group">
                        <div class="input-group-prepend">
                          <span class="input-group-text">
                            <i class="fa fa-lock" aria-hidden="true"></i>
                          </span>
                        </div>
                        <input
                          type="password"
                          v-model="input.password"
                          class="form-control"
                          placeholder="Password"
                          v-on:keyup.enter="login()"
                          required
                        />
                      </div>
                    </div>
                    <div class="text-center">
                      <button
                        :disabled="loading"
                        :class="
                          loading
                            ? 'btn btn-block btn-primary my-4 disabled'
                            : 'btn btn-block btn-primary my-4 '
                        "
                        v-on:click="login()"
                      >
                        <span
                          v-if="loading"
                          class="spinner-border spinner-border-sm"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        {{ loading ? "Validando.." : "Entrar" }}
                      </button>
                    </div>
                  </form>
                </div>
                <div class="row mt-3 h4">
                  <div class="col-6">
                    <router-link class="text-link font-weight-normal" to="/olvido"
                      >Olvide mi contraseña</router-link
                    >
                  </div>
                  <div class="col-6 ">
                    <router-link class="text-link font-weight-normal " to="/Registro"
                      >Crear cuenta</router-link
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </section>

    <footer class="fixed-bottom  bg-gradient-info " >
      <div class="container ">
        <div class="row">
         <!-- <div class="col-lg-8 mb-4 mx-auto text-center">
            <a
              href="#"
              target="_blank"
              class="text-secondary me-xl-5 me-3 mb-sm-0 mb-2"
            >
              Company
            </a>
            <a
              href="#"
              target="_blank"
              class="text-secondary me-xl-5 me-3 mb-sm-0 mb-2"
            >
              About Us
            </a>
            <a
              href="#"
              target="_blank"
              class="text-secondary me-xl-5 me-3 mb-sm-0 mb-2"
            >
              Team
            </a>
            <a
              href="#"
              target="_blank"
              class="text-secondary me-xl-5 me-3 mb-sm-0 mb-2"
            >
              Products
            </a>
            <a
              href="#"
              target="_blank"
              class="text-secondary me-xl-5 me-3 mb-sm-0 mb-2"
            >
              Blog
            </a>
            <a
              href="#"
              target="_blank"
              class="text-secondary me-xl-5 me-3 mb-sm-0 mb-2"
            >
              Pricing
            </a>
          </div>
        -->
          <div class="col-lg-8 mx-auto text-center mb-4 mt-2">
            <a href="#" target="_blank" class="text-secondary me-xl-4 me-4">
              Soft<b>Lineas</b>
            </a>
            <a href="#" target="_blank" class="text-secondary me-xl-4 me-4">
              <span class="text-lg fab fa-dribbble"></span>
            </a>
            <a href="#" target="_blank" class="text-secondary me-xl-4 me-4">
              <span class="text-lg fab fa-twitter"></span>
            </a>
            <a href="#" target="_blank" class="text-secondary me-xl-4 me-4">
              <span class="text-lg fab fa-instagram"></span>
            </a>
                        
          </div>
        </div>
        <!--<div class="row">
          <div class="col-8 mx-auto text-center mt-1">
            <p class="mb-0 text-secondary">
              <small>Copyright ©
              <script type="javascript">
                document.write(new Date().getFullYear());
              </script>
              Soft by Soflineas team (luci-3)</small>
                           
            </p>
          </div>
        </div>-->
      </div>
    </footer>

    <!--<div
      class="col-6 d-lg-flex d-none h-100  pe-0 position-absolute top-0 end-0 text-center justify-content-center flex-column"
    >
      <div
        class="position-relativ bg-gradient-primary h-100 m-3 px-7 border-radius-lg d-flex flex-column justify-content-center overflow-hidden"
      >
        <span class="mask bg-gradient-primary opacity-6"></span>
        <h4 class="mt-5 text-white font-weight-bolder position-relative">
          "Attention is the new currency"
        </h4>
        <p class="text-white position-relative">
          The more effortless the writing looks, the more effort the writer
          actually put into the process.
        </p>
      </div>
    </div>
    -->
  </div>
</template>

<script src="../controller/LoginController.js"></script>

<style>

body{
  background: rgb(49,209,224);
  background: linear-gradient(90deg, rgba(49,209,224,1) 0%, rgba(16,142,242,1) 41%, rgba(16,142,242,1) 100%);    
}


.div-imagen-fondo {
  background-image: url("../assets/bc_softlineas.png") !important;
                  
  /* Para este ejemplo usamos el archivo que está dentro de una carpeta imagenes 
  en nuestro proyecto */

  /* 
  Puedes modificar como se ve la imagen de fondo con las siguientes propiedades:
  */
 
  /*background-position: 0cm;*/
  background-repeat: repeat-x;
  background-size: contain;
  
  
  

  /* A continuación explicamos cada como funciona cada propiedad. */
}
</style>
