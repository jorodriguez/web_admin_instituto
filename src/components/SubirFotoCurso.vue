<template>
<div>
    <h1>Foto del curso</h1>
    
    <div class="row mb-3 d-flex justify-content-between">
        <button class="btn btn-secondary btn-lg" @click="$router.go(-1)">
            <i class="fas fa-arrow-circle-left text-gray"></i>
        </button>
        <h2>
            <span :class="`${
            sucursal.credito_fotos > 0 ? 'bg-yellow' : 'bg-danger text-white'
          } p-1  rounded`">
                {{ sucursal.credito_fotos }}
            </span>
            <span class="text-gray">Créditos</span>
        </h2>
    </div>

    <div class="alert alert-danger" v-if="
        !sucursal.plan_foto_cursos ||
        (sucursal.plan_foto_cursos && sucursal.credito_fotos <= 0)
      ">
        <i class="fa fa-meh-o" aria-hidden="true"></i>
        <span v-if="!sucursal.plan_foto_cursos">
            <strong>AVISO!</strong>
            No es posible subir fotos, por favor comunicate con el equipo de soporte
            y pide que te
            <strong>actualice tu plan</strong>
            .
        </span>
        <span v-if="(sucursal.plan_foto_cursos && sucursal.credito_fotos <= 0)">
            <strong>AVISO!</strong>
            No es posible subir fotos, por favor comunicate con el equipo de soporte
            y pide que aumente el crédito en fotos.
        </span>
    </div>
    <div class="alert alert-danger" v-else-if="curso.public_id_foto != null">
        <i class="fa fa-meh-o" aria-hidden="true"></i>
        <strong>AVISO!</strong>
        El curso seleccionado ya tiene una foto de perfil si la actualizas se
        <strong>agregaran gastos</strong>
        a la facturación mensual.
    </div>

    <div class="card">
        <div class="card-body">
            <div class="row">
                <div class="col-12 col-sm-12 col-md-12 col-lg-3 col-xl-3">
                    <div class="mx-auto">
                        <img v-if="curso.public_id_foto" style="border-radius: 100px; width: 200px; heigth: 200px;" class="mb-1" :src="curso.foto" />                        

                        <croppa v-else v-model="myCroppa" 
                                :initial-image="`${curso.foto}`" :width="200" :height="200" :quality="0.9" :remove-button-size="1" prevent-white-space :accept="'image/*'" :placeholder="'Clic aquí para seleccionar foto'" :placeholder-font-size="12" :placeholder-color="'#3E85CC'" @file-type-mismatch="onFileTypeMismatch" @file-size-exceed="onFileSizeExceed" :disabled="
                              this.loadingUpload ||
                              !sucursal.plan_foto_cursos ||         curso.public_id_foto ||                            sucursal.credito_fotos <= 0
                "></croppa>
                    </div>

                    <div class="mx-auto">
                        <div class="btn-group btn-group-sm mb-2 mx-auto" role="group" aria-label="Basic example">
                            <button type="button" class="btn btn-light" data-toggle="button" aria-pressed="false" autocomplete="off" :disabled="
                    this.loadingUpload ||
                    !sucursal.plan_foto_cursos ||
                    curso.public_id_foto ||
                    sucursal.credito_fotos <= 0
                  " @click="zoomOut()">
                                <i class="fa fa-search-minus" aria-hidden="true"></i>
                            </button>
                            <button type="button" class="btn btn-light" data-toggle="button" aria-pressed="false" autocomplete="off" :disabled="
                    this.loadingUpload ||
                    !sucursal.plan_foto_cursos ||
                    curso.public_id_foto ||
                    sucursal.credito_fotos <= 0
                  " @click="flipX()">
                                <i class="fas fa-arrows-alt-h"></i>
                            </button>
                            <button type="button" class="btn btn-light" data-toggle="button" aria-pressed="false" autocomplete="off" :disabled="
                    this.loadingUpload ||
                    !sucursal.plan_foto_cursos ||
                    curso.public_id_foto ||
                    sucursal.credito_fotos <= 0
                  " @click="rotate()">
                                <i class="fas fa-redo"></i>
                            </button>
                            <button type="button" class="btn btn-light" data-toggle="button" aria-pressed="false" autocomplete="off" :disabled="
                    this.loadingUpload ||
                    !sucursal.plan_foto_cursos ||
                    curso.public_id_foto ||
                    sucursal.credito_fotos <= 0
                  " @click="flipY()">
                                <i class="fas fa-arrows-alt-v"></i>
                            </button>
                            <button type="button" class="btn btn-light" data-toggle="button" aria-pressed="false" autocomplete="off" :disabled="
                    this.loadingUpload ||
                    !sucursal.plan_foto_cursos ||
                    curso.public_id_foto ||
                    sucursal.credito_fotos <= 0
                  " @click="zoomIn()">
                                <i class="fa fa-search-plus" aria-hidden="true"></i>
                            </button>
                        </div>

                        <div class="row">
                
                            <button type="button" class="btn btn-success btn-block" data-toggle="button" aria-pressed="false" autocomplete="off" :disabled="
                    this.loadingUpload ||
                    !sucursal.plan_foto_cursos ||
                    curso.public_id_foto ||
                    sucursal.credito_fotos <= 0
                  " @click="generateImage(false)">
                                {{
                    this.loadingUpload
                      ? 'Actualizando foto..'
                      : 'Actualizar foto'
                  }}
                            </button>
                            <button type="button" class="btn btn-danger btn-block" data-toggle="button" aria-pressed="false" autocomplete="off" v-if="curso.public_id_foto" @click="quitarFoto()">
                                Quitar foto
                            </button>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                    <table class="table table-sm text-left">
                        <tr>
                            <td></td>
                        </tr>
                        <tr>
                            <td>
                                <h4>{{ this.curso.especialidad }}</h4>
                            </td>
                        </tr>                     
                       
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import Popup from '../controller/Popup'
import {
    operacionesApi
} from '../helpers/OperacionesApi'
import {
    getUsuarioSesion
} from '../helpers/Sesion'

import URL from '../helpers/Urls'
import Vue from 'vue'

import Croppa from 'vue-croppa'
Vue.use(Croppa)
import 'vue-croppa/dist/vue-croppa.css'
/* eslint-disable */
export default {
    components: {
        Popup,      
    },
    mixins: [operacionesApi],
    name: 'upload',
    data() {
        return {
            uid: '',
            path_retorno: '',
            resultado: {},
            usuarioSesion: {},
            sucursal: {},
            criterioNombre: '',
            listacursos: [],
            lista: [],
            curso: {
                id: 0,
                nombre: '',
                foto: ''
            },
            myCroppa: {},
            imgUrl: '',
            cargacurso: false,
            loadingCatalogo: false,
            loadingUpload: false,
            loadingPage: false,
        }
    },
    beforeRouteUpdate(to) {
        console.log('uid = ' + this.uid)
        console.log(' ' + to)
        this.uid = to.params.uid
        this.path_retorno = to.params.path_retorno
    },
    async mounted() {
        this.onInit()
        this.uid = this.$route.params.uid
        console.log('@ide recibido ' + this.uid)
        await this.cargarCurso()
        await this.cargarInformacionSucursal()
        this.path_retorno = this.$route.params.path_retorno
    },
    methods: {
        onInit() {
            this.usuarioSesion = getUsuarioSesion()
        },          

        async cargarInformacionSucursal() {
            this.sucursal = await this.getAsync(
                `${URL.SUCURSAL_BASE}/${this.usuarioSesion.co_sucursal}`,
            )
        },
        async cargarCurso() {
            if (!this.uid) {
                this.$notificacion.error(
                    'No se encontro el cruso',
                    'Al parecer no encontramos el curso que busca.',
                )
                return
            }
            this.curso = await this.getAsync(`${URL.CURSO}/uid/${this.uid}`)
            this.loadingUpload = false
        },
        quitarFoto() {
            this.curso.public_id_foto = null
        },
        seleccionarcurso(row) {
            console.log('seleccion ' + JSON.stringify(row))
            this.curso = row
        },
        onFileTypeMismatch(file) {
            alert('Tipo de archivo invalido. Por favor seleccione jpeg ó png.')
        },
        onFileSizeExceed(file) {
            alert('Archivo excedido. Por favor seleccione un archivo menor a 1.5mb.')
        },
        generateImage(preview) {
            console.log('Upload ')

            let url = this.myCroppa.generateDataUrl()
            if (!url) {
                alert('no image')
                return
            }
            this.imgUrl = url
            this.curso.foto = url

            if (!preview) {
                this.myCroppa.generateBlob(
                    (blob) => {
                        // write code to upload the cropped image file (a file is a blob)
                        this.subir(blob)
                    },
                    'image/jpeg',
                    0.7,
                )
            }
        },
        subir(blob) {
            let data = new FormData()
            data.append('name', 'image')
            data.append('image', blob)
            data.append('id_curso', this.curso.id)
            data.append('genero', this.usuarioSesion.id)
            this.loadingUpload = true
            let thus = this
            this.post(URL.IMAGEN_CURSO, data, (result) => {
                console.log(JSON.stringify(result))
                let respuesta = result.data
                if (respuesta != null) {
                    thus.cargarCurso()
                    thus.cargarInformacionSucursal()
                    thus.$notificacion.info(
                        'Actualización de la foto',
                        'Se actualizó la foto del curso.',
                    )
                } else {
                    thus.$notificacion.error(
                        'Error en lactualización de la foto',
                        'Sucedió un error al tratar de actualizar la foto del curso.',
                    )
                }
            })
        },

        zoomIn() {
            this.myCroppa.zoomIn()
        },
        zoomOut() {
            this.myCroppa.zoomOut()
        },
        rotate() {
            this.myCroppa.rotate()
        },

        flipX() {
            this.myCroppa.flipX()
        },

        flipY() {
            this.myCroppa.flipY()
        },
        remove() {
            this.myCroppa.remove()
        },
      

    },
}
</script>
