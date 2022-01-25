<template>
  <div class="login container">
   <section class="section section-shaped section-lg">
      <!--  bg-gradient-default-->
      <div class="shape shape-style-1 ">
        <div class="container pt-lg-7">
          <div class="row justify-content-center">
            <div class="col-lg-5">
              <div class="card bg-secondary shadow border-0">
                <div class="card-header bg-white pb-5 text-center">                  
                  <img src="https://res.cloudinary.com/dwttlkcmu/image/upload/v1640639519/static/thumbnail_LOGO_PARIS_aw1o2o.png" height="80" width="140" />                  
                
                </div>
                <div class="card-body px-lg-5 py-lg-5">
                  <form role="form">
        
                    <div class="form-group mb-3">
                      
                      <div class="input-group input-group-alternative">
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
                      
                      <div class="input-group input-group-alternative">
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
                        :class="loading ? 'btn btn-block btn-primary my-4 disabled':'btn btn-block btn-primary my-4 '"
                        v-on:click="login()"
                      >
                        <span
                          v-if="loading"
                          class="spinner-border spinner-border-sm"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        {{loading ? 'Validando..':'Entrar'}}
                      </button>                      
                    </div>                    
                     
                  </form>               
               </div>
              </div>
              <div class="row mt-3 h4">
                <div class="col-6">
                  <router-link class="text-link" to="/olvido">Olvide mi contraseña</router-link>                  
                </div>
                <div class="col-6 text-right">
                  <router-link class="text-link" to="/Registro">Crear cuenta</router-link>                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!--
    <img src="../assets/logo.jpeg" class="rounded-lg" width="235" height="110" />

    <form class="form-signin">
      <h1 class="h3 mb-3 font-weight-normal"></h1>
      <input
        type="email"
        v-model="input.correo"
        class="form-control"
        placeholder="Correo"
        v-on:keyup.enter="login()"
        required
        autofocus
      />
      <input
        type="password"
        v-model="input.password"
        class="form-control"
        placeholder="Password"
        v-on:keyup.enter="login()"
        required
      />

      <a
        :class="loading ? 'btn btn-lg btn-primary btn-block text-white disabled':'btn btn-lg btn-primary btn-block text-white'"
        v-on:click="login()"
      >        

       <span v-if="loading" class="spinner-border" role="status" aria-hidden="true"></span> {{loading ? 'Validando..':'Entrar'}}       
      </a> 
      
      <br>
      <br>

      
      <div
        id="toast_id"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        class="toast border-warning"
        data-autohide="true"
        data-delay="1000"
      >
        <div class="toast-header p-1 mb-1 bg-warning text-dark">
          <strong class="mr-auto">Login</strong>
          <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="toast-body">
          <p id="toast_msg"></p>
        </div>
      </div>
      
    </form>    
    -->
  </div>
</template>

<script src="../controller/LoginController.js"></script>

<style scoped>
</style>

