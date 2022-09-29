const app = Vue.
createApp({
    data() {
        return {
            productos:[],
            carrito:[],
            carritoInStorage:[],
            productosFiltrados:[],
            input:""
        }

    },

    created(){
            fetch("https://apipetshop.herokuapp.com/api/articulos")
            .then(response => response.json())
            .then((json) => {
                this.productos = json.response
                this.productosFiltrados = this.productos
                let carritoInStorage = JSON.parse(localStorage.getItem("productos"))
                if(carritoInStorage){
                    this.carrito = carritoInStorage
                }
            })
            .catch((error) => console.log(error))
    },

    methods: {
        carritoCompras(producto){
            let productos = this.carrito.filter(item => item._id == producto._id)[0]
            if(productos != undefined){
                productos.cantidad++
                localStorage.setItem("productos",JSON.stringify(this.carrito))
                
            }else{
                let productos = {
                    _id: producto._id,
                    nombre: producto.nombre,
                    descripcion: producto.descripcion,
                    precio: producto.precio,
                    stock: producto.stock,
                    imagen: producto.imagen,
                    cantidad:1
                }
                this.carrito.push(productos)
                localStorage.setItem("productos",JSON.stringify(this.carrito))
            }
            producto.stock--
        },
        restar(producto){
            let productos = this.carrito.filter(item => item._id == producto._id)[0]
            if(productos != undefined){
                productos.cantidad--
                localStorage.setItem("productos",JSON.stringify(this.carrito))
                
            }else{
                let productos = {
                    _id: producto._id,
                    nombre: producto.nombre,
                    descripcion: producto.descripcion,
                    precio: producto.precio,
                    stock: producto.stock,
                    imagen: producto.imagen,
                    cantidad:1
                }
                this.carrito.push(productos)
                localStorage.setItem("productos",JSON.stringify(this.carrito))
            }
            producto.stock--
        },
        eliminarProducto(producto){
            let productos = this.productos.filter(item => item._id == producto._id)[0]
            productos.stock += producto.cantidad
            let indiceProducto = 0
            this.carrito.forEach((item, i) =>
                item._id == producto._id ? (indiceProducto = i) : null
                
            );
            this.carrito.splice(indiceProducto, 1);
            localStorage.setItem("productos",JSON.stringify(this.carrito))
        },
        orderPrecioBajo(){
            this.productos.sort((a, b) =>{
                if (a.precio < b.precio) {
                    return -1;
                }
                else if(a.precio > b.precio){
                    return 1
                }
                return 0
            })
        },
        orderPrecioAlto(){
            this.productos.sort((a, b) =>{
                if (a.precio < b.precio) {
                    return 1;
                }
                else if(a.precio > b.precio){
                    return -1
                }
                return 0
            })
        },
    },

    computed: {
        cantidadDeProductos() {
            return this.carrito.reduce((acc, item) => acc + item.cantidad, 0)
        },
        totalAPagar() {
            return this.carrito.reduce((acc, item) => acc + item.cantidad * item.precio, 0);
        },
        filterSerch() {
            this.productosFiltrados = this.productos.filter(item => item.nombre.toLowerCase().includes(this.input.toLowerCase()))
        },
        

    }
}).mount('#app')
