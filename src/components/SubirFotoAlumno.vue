<template>
<div>
    <h1>Foto del perfil</h1>
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
        !sucursal.plan_foto_alumnos ||
        (sucursal.plan_foto_alumnos && sucursal.credito_fotos <= 0)
      ">
        <i class="fa fa-meh-o" aria-hidden="true"></i>
        <span v-if="!sucursal.plan_foto_alumnos">
            <strong>AVISO!</strong>
            No es posible subir fotos, por favor comunicate con el equipo de soporte
            y pide que te
            <strong>actualice tu plan</strong>
            .
        </span>
        <span v-if="(sucursal.plan_foto_alumnos && sucursal.credito_fotos <= 0)">
            <strong>AVISO!</strong>
            No es posible subir fotos, por favor comunicate con el equipo de soporte
            y pide que aumente el crédito en fotos.
        </span>
    </div>
    <div class="alert alert-danger" v-else-if="alumno.public_id_foto != null">
        <i class="fa fa-meh-o" aria-hidden="true"></i>
        <strong>AVISO!</strong>
        El alumno seleccionado ya tiene una foto de perfil si la actualizas se
        <strong>agregaran gastos</strong>
        a la facturación mensual.
    </div>

    <div class="card">
        <div class="card-body">
            <div class="row">
                <div class="col-12 col-sm-12 col-md-12 col-lg-3 col-xl-3">
                    <div class="mx-auto">
                        <img v-if="alumno.public_id_foto" style="border-radius: 100px; width: 200px; heigth: 200px;" class="mb-1" :src="alumno.foto" />
                        <!-- :file-size-limit="102400 * 15"-->
                        <!--  canvas-color="transparent"-->
                        <croppa v-else v-model="myCroppa" :initial-image="`${alumno.foto}`" :width="200" :height="200" :quality="0.9" :remove-button-size="1" prevent-white-space :accept="'image/*'" :placeholder="'Clic aquí para seleccionar foto'" :placeholder-font-size="12" :placeholder-color="'#3E85CC'" @file-type-mismatch="onFileTypeMismatch" @file-size-exceed="onFileSizeExceed" :disabled="
                  this.loadingUpload ||
                  !sucursal.plan_foto_alumnos ||
                  alumno.public_id_foto ||
                  sucursal.credito_fotos <= 0
                "></croppa>
                    </div>

                    <div class="mx-auto">
                        <div class="btn-group btn-group-sm mb-2 mx-auto" role="group" aria-label="Basic example">
                            <button type="button" class="btn btn-light" data-toggle="button" aria-pressed="false" autocomplete="off" :disabled="
                    this.loadingUpload ||
                    !sucursal.plan_foto_alumnos ||
                    alumno.public_id_foto ||
                    sucursal.credito_fotos <= 0
                  " @click="zoomOut()">
                                <i class="fa fa-search-minus" aria-hidden="true"></i>
                            </button>
                            <button type="button" class="btn btn-light" data-toggle="button" aria-pressed="false" autocomplete="off" :disabled="
                    this.loadingUpload ||
                    !sucursal.plan_foto_alumnos ||
                    alumno.public_id_foto ||
                    sucursal.credito_fotos <= 0
                  " @click="flipX()">
                                <i class="fas fa-arrows-alt-h"></i>
                            </button>
                            <button type="button" class="btn btn-light" data-toggle="button" aria-pressed="false" autocomplete="off" :disabled="
                    this.loadingUpload ||
                    !sucursal.plan_foto_alumnos ||
                    alumno.public_id_foto ||
                    sucursal.credito_fotos <= 0
                  " @click="rotate()">
                                <i class="fas fa-redo"></i>
                            </button>
                            <button type="button" class="btn btn-light" data-toggle="button" aria-pressed="false" autocomplete="off" :disabled="
                    this.loadingUpload ||
                    !sucursal.plan_foto_alumnos ||
                    alumno.public_id_foto ||
                    sucursal.credito_fotos <= 0
                  " @click="flipY()">
                                <i class="fas fa-arrows-alt-v"></i>
                            </button>
                            <button type="button" class="btn btn-light" data-toggle="button" aria-pressed="false" autocomplete="off" :disabled="
                    this.loadingUpload ||
                    !sucursal.plan_foto_alumnos ||
                    alumno.public_id_foto ||
                    sucursal.credito_fotos <= 0
                  " @click="zoomIn()">
                                <i class="fa fa-search-plus" aria-hidden="true"></i>
                            </button>
                        </div>

                        <div class="row">
                            <!--<button
                  type="button"
                  class="btn btn-light btn-block"
                  data-toggle="button"
                  aria-pressed="false"
                  autocomplete="off"                  
                  :disabled="this.loadingUpload || !sucursal.plan_foto_alumnos"
                  @click="generateImage(true)"
                >Previsualizar</button>-->
                            <button type="button" class="btn btn-success btn-block" data-toggle="button" aria-pressed="false" autocomplete="off" :disabled="
                    this.loadingUpload ||
                    !sucursal.plan_foto_alumnos ||
                    alumno.public_id_foto ||
                    sucursal.credito_fotos <= 0
                  " @click="generateImage(false)">
                                {{
                    this.loadingUpload
                      ? 'Actualizando foto..'
                      : 'Actualizar foto'
                  }}
                            </button>
                            <button type="button" class="btn btn-danger btn-block" data-toggle="button" aria-pressed="false" autocomplete="off" v-if="alumno.public_id_foto" @click="quitarFoto()">
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
                                <h4>{{ this.alumno.matricula }}</h4>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <h4>{{ this.alumno.nombre }} {{ this.alumno.apellidos }}</h4>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <h4>{{ alumno.telefono }}</h4>
                            </td>
                        </tr>
                        <tr>
                            <td>               
                            
                              <div class="row">
                              <div class="col">
                                <button class="btn btn-link btn-block" :disabled="!alumno.public_id_foto" @click="printCredencial()">
                                    <i class="fas fa-print" />
                                    Imprimir Credencial 
                                </button>
                                </div>
                                <div class="col">
                                <button class="btn btn-link btn-block" :disabled="!alumno.public_id_foto" @click="consultaEstado()">
                                    <i class="fa fa-money-bill"></i>
                                    Checar estado de cuenta
                                </button>
                                </div>
                              </div>
                            
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
import {
    filtrarNombreAlumno
} from '../helpers/FiltarUtils'
import URL from '../helpers/Urls'
import Vue from 'vue'
import ItemCapsulaAlumno from '../components_utils/ItemCapsulaAlumno'
import VueHtml2pdf from 'vue-html2pdf'

import Croppa from 'vue-croppa'
Vue.use(Croppa)
import 'vue-croppa/dist/vue-croppa.css'
/* eslint-disable */
export default {
    components: {
        Popup,
        ItemCapsulaAlumno,
        VueHtml2pdf,
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
            listaAlumnos: [],
            lista: [],
            alumno: {
                id: 0,
                nombre: '',
                foto: ''
            },
            myCroppa: {},
            imgUrl: '',
            cargaAlumno: false,
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
        await this.cargarAlumno()
        await this.cargarInformacionSucursal()
        this.path_retorno = this.$route.params.path_retorno
    },
    methods: {
        onInit() {
            this.usuarioSesion = getUsuarioSesion()

            //------- este add es para hacer redonda la imagen
            /*this.myCroppa.addClipPlugin(function (ctx, x, y, w, h) {
              
              console.log(x, y, w, h);
              ctx.beginPath();
              ctx.arc(x + w / 2, y + h / 2, w / 2, 0, 2 * Math.PI, true);
              ctx.closePath();
            });*/
            //------- este add es para hacer redonda la imagen
        },
        async beforeDownload({
            html2pdf,
            options,
            pdfContent
        }) {
            await html2pdf()
                .set(options)
                .from(pdfContent)
                .toPdf()
                .get('pdf')
                .then((pdf) => {
                    const totalPages = pdf.internal.getNumberOfPages()
                    for (let i = 1; i <= totalPages; i++) {
                        pdf.setPage(i)
                        pdf.setFontSize(10)
                        pdf.setTextColor(150)
                        pdf.text(
                            'Page ' + i + ' of ' + totalPages,
                            pdf.internal.pageSize.getWidth() * 0.88,
                            pdf.internal.pageSize.getHeight() - 0.3,
                        )
                    }
                })
                .save()
        },
        async printCredencial() {

            this.loadingPage = true

            this.pagePreview = await this.getAsync(
                `${URL.IMPRESION_BASE}/credencial/${this.uid}/html/${this.usuarioSesion.id}`,
            )

            this.loadingPage = false;

            const WinPrint = window.open('', '', 'width=800,height=900', "_self")

            WinPrint.document.write(`
             
              ${this.pagePreview}
             
          `);
            setTimeout(() => {
                WinPrint.document.close();
                WinPrint.focus()
                WinPrint.print()
                WinPrint.close()
            }, 500)

        },

        downloadPdf() {
            var oReq = new XMLHttpRequest()
            oReq.open('GET', `${URL.IMPRESION_BASE}/credencial/${this.uid}/PDF/${this.usuarioSesion.id}`, true);
            oReq.responseType = 'arraybuffer';

            oReq.onload = function (oEvent) {
                console.log(oReq.response)
                var blob = new Blob([oReq.response], {
                    type: 'application/pdf'
                })
                var win = window.open('', '_blank')
                var URL = window.URL || window.webkitURL
                var dataUrl = URL.createObjectURL(blob)
                win.location = dataUrl
            }
            oReq.send()
        },

        cargarCatalogoAlumnos() {
            if (this.listaAlumnos.length == 0) {
                this.loadingCatalogo = true
                this.get(
                    URL.ALUMNOS_BASE + '/' + this.usuarioSesion.co_sucursal,
                    (result) => {
                        this.response = result.data
                        console.log('Consulta ' + JSON.stringify(this.response))
                        if (this.response != null) {
                            this.listaAlumnos = this.response
                            this.lista = this.response
                            this.loadingCatalogo = false
                        }
                    },
                )
            } else {
                console.log('La lista ya se encuentra cargada')
            }
        },
        async cargarInformacionSucursal() {
            this.sucursal = await this.getAsync(
                `${URL.SUCURSAL_BASE}/${this.usuarioSesion.co_sucursal}`,
            )
        },
        async cargarAlumno() {
            if (!this.uid) {
                this.$notificacion.error(
                    'No se encotro el alumno',
                    'Al parecer no encontramos al alumno que busca.',
                )
                return
            }
            this.alumno = await this.getAsync(`${URL.ALUMNOS_BASE}/id/${this.uid}`)
            this.loadingUpload = false
        },
        quitarFoto() {
            this.alumno.public_id_foto = null
        },
        seleccionarAlumno(row) {
            console.log('seleccion ' + JSON.stringify(row))
            this.alumno = row
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
            this.alumno.foto = url

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
            data.append('id_alumno', this.alumno.id)
            data.append('genero', this.usuarioSesion.id)
            this.loadingUpload = true
            let thus = this
            this.post(URL.IMAGEN_PERFIL, data, (result) => {
                console.log(JSON.stringify(result))
                let respuesta = result.data
                if (respuesta != null) {
                    thus.cargarAlumno()
                    thus.cargarInformacionSucursal()
                    thus.$notificacion.info(
                        'Actualización de la foto',
                        'Se actualizó la foto de perfil del alumno.',
                    )
                } else {
                    thus.$notificacion.error(
                        'Error en lactualización de la foto',
                        'Sucedió un error al tratar de actualizar la foto de perfil.',
                    )
                }
            })
        },
        buscarPorNombre() {
            console.log('Buscar por nombre ' + this.criterioNombre)

            this.lista = filtrarNombreAlumno(this.criterioNombre, this.listaAlumnos)

            /* if (this.criterioNombre == "") {
              this.lista = this.listaAlumnos;
            } else {
              this.lista = this.listaAlumnos.filter(
                e =>
                  e.nombre
                    .toUpperCase()
                    .includes(this.criterioNombre.toUpperCase()) ||
                  (e.nombre_carino
                    ? e.nombre_carino
                        .toUpperCase()
                        .includes(this.criterioNombre.toUpperCase())
                    : false)
              );
            }*/
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
        imprimirCredencial() {
            this.$router.push({
                name: 'ImprimirCredencial',
                params: {
                    uid: this.uid
                },
            })
        },
        consultaEstado() {

            this.$router.push({
                name: 'ConsultarEstadoAlumno',
                params: {
                    uid: this.uid
                },
            })
        }

    },
}
</script>
