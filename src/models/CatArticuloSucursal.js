export default class CatArticuloSucursal {
  constructor() {
    this.id = null;
    this.co_empresa = null;
    this.co_sucursal = null;
    this.cat_articulo = null;
    this.genero = null;
    this.modifico = null;
    this.precio = null;
    this.fecha_genero = null;
    this.fecha_modifico = null;
    this.cantidad_existencia = null;
    this.nota_interna = "";
    this.eliminado = null;
    this.costo_base = null;
    this.stock_minimo = null;    

    this.foto=null;
    this.codigo=null;    
    this.cat_marca=null;
    this.cat_categoria=null;
    this.nombre ="";
    this.descripcion=""
  }
  setId(id) {
    this.id = id;
    return this;
  }
  setFoto(foto) {
    this.foto = foto;
    return this;
  }
  setCodigo(codigo) {
    this.codigo = codigo;
    return this;
  }
  setCatMarca(catMarca) {
    this.catMarca = catMarca;
    return this;
  }
  setCatCategoria(catCategoria) {
    this.catCategoria = catCategoria;
    return this;
  }
  setNombre(nombre) {
    this.nombre = nombre;
    return this;
  }
  setDescripcion(descripcion) {
    this.descripcion = descripcion;
    return this;
  }
  setCoEmpresa(coEmpresa) {
    this.co_empresa = coEmpresa;
    return this;
  }
  setCoSucursal(coSucursal) {
    this.co_sucursal = coSucursal;
    return this;
  }
  setCatArticulo(catArticulo) {
    this.cat_articulo = catArticulo;
    return this;
  }
  setGenero(genero) {
    this.genero = genero;
    return this;
  }
  setModifico(modifico) {
    this.modifico = modifico;
    return this;
  }
  setPrecio(precio) {
    this.precio = precio;
    return this;
  }
  setFechaGenero(fechaGenero) {
    this.fecha_genero = fechaGenero;
    return this;
  }
  setFechaModifico(fechaModifico) {
    this.fecha_modifico = fechaModifico;
    return this;
  }
  setCantidadExistencia(cantidadExistencia) {
    this.cantidad_existencia = cantidadExistencia;
    return this;
  }
  setNotaInterna(notaInterna) {
    this.nota_interna = notaInterna;
    return this;
  }
  setEliminado(eliminado) {
    this.eliminado = eliminado;
    return this;
  }
  setCostoBase(costoBase) {
    this.costo_base = costoBase;
    return this;
  }
  setStockMinimo(stockMinimo) {
    this.stock_minimo = stockMinimo;
    return this;
  }
  buildForInsert() {
    return {      
      co_empresa: this.co_empresa,
      co_sucursal: this.co_sucursal,
      cat_articulo: this.cat_articulo,
      genero: this.genero,
      modifico: this.modifico,
      precio: this.precio,            
      cantidad_existencia: this.cantidad_existencia,
      nota_interna: this.nota_interna,      
      costo_base: this.costo_base,
      stock_minimo: this.stock_minimo,
      foto:this.foto,
      codigo:this.codigo,
      cat_marca:this.cat_marca,
      cat_categoria:this.cat_categoria,
      nombre:this.nombre,
      descripcion:this.descripcion
    };
  }

  buildForUpdate() {
    return {           
      /*codigo:this.codigo,*/
      cat_articulo: this.cat_articulo,      
      precio: this.precio,                  
      nota_interna: this.nota_interna,      
      costo_base: this.costo_base,
      stock_minimo: this.stock_minimo,            
      cat_marca:this.cat_marca,
      cat_categoria:this.cat_categoria,
      nombre:this.nombre,
      descripcion:this.descripcion,
      modifico: this.modifico,
    };
  }
}
