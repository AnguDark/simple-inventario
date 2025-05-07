import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BannerAdOptions, BannerAdSize, AdMob, BannerAdPosition,  } from '@capacitor-community/admob';
import { IonicModule } from '@ionic/angular';
import { AlertController } from '@ionic/angular';


@Component({
  imports: [CommonModule, IonicModule, FormsModule],
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  productos = [
    { id: 1, categoria: 'Electrónica ', descripcion: 'Smartphone', precio: 500 },
    { id: 2, categoria: 'Electrónica', descripcion: 'Laptop', precio: 1200 },
    { id: 2, categoria: 'Electrónica', descripcion: 'Laptop', precio: 1200 },
    { id: 2, categoria: 'Electrónica', descripcion: 'Laptop', precio: 1200 },
    { id: 2, categoria: 'Electrónica', descripcion: 'Laptop', precio: 1200 },
    { id: 2, categoria: 'Electrónica', descripcion: 'Laptop', precio: 1200 },
    { id: 2, categoria: 'Electrónica', descripcion: 'Laptop', precio: 1200 },
    { id: 2, categoria: 'Electrónica', descripcion: 'Laptop', precio: 1200 },
    { id: 2, categoria: 'Electrónica', descripcion: 'Laptop', precio: 1200 },
    { id: 2, categoria: 'Electrónica', descripcion: 'Laptop', precio: 1200 },
    { id: 3, categoria: 'Hogar', descripcion: 'Sofá', precio: 300 },
    { id: 4, categoria: 'Hogar', descripcion: 'Mesa', precio: 150 },
    { id: 5, categoria: 'Ropa', descripcion: 'Camiseta', precio: 20 },
    { id: 6, categoria: 'Ropa', descripcion: 'Pantalón', precio: 40 },
    { id: 7, categoria: 'Coca Cola', descripcion: 'Camiseta', precio: 20 },
    { id: 8, categoria: 'Pepsi', descripcion: 'Pantalón', precio: 40 },
    { id: 9, categoria: 'Joya', descripcion: 'Camiseta', precio: 20 },
    { id: 10, categoria: 'Pepsi', descripcion: 'Pantalón', precio: 40 },
  ];

  categorias: string[] = [];
  productosFiltrados: { id: number; categoria: string; descripcion: string; precio: number }[] = [];
  categoriaSeleccionada: string = ''; // Categoría seleccionada por defecto

  modalAbierto = false; // Estado del modal
  nuevoProducto = { id: 0, categoria: '', descripcion: '', precio: 0 }; // Datos del nuevo producto

  constructor(private alertController: AlertController) { }

  ngOnInit() {
    // Obtener categorías únicas
    this.categorias = [...new Set(this.productos.map((p) => p.categoria))];

    // Establecer la primera categoría como seleccionada por defecto
    if (this.categorias.length > 0) {
      this.categoriaSeleccionada = this.categorias[0];
      this.filtrarPorCategoria(this.categoriaSeleccionada);
    }

    this.mostrarBanner();
  }

  filtrarPorCategoria(categoria: string) {
    if (categoria) {
      this.productosFiltrados = this.productos.filter(
        (producto) => producto.categoria === categoria
      );
    } else {
      this.productosFiltrados = this.productos; // Mostrar todos los productos si no hay categoría seleccionada
    }
  }

  abrirModal() {
    this.modalAbierto = true;
  }

  cerrarModal() {
    this.modalAbierto = false;
    this.nuevoProducto = { id: 0, categoria: '', descripcion: '', precio: 0 }; // Reiniciar el formulario
  }

  crearProducto() {
    if (this.nuevoProducto.id) {
      // Si el producto tiene un ID, actualiza el producto existente
      const index = this.productos.findIndex((p) => p.id === this.nuevoProducto.id);
      if (index !== -1) {
        this.productos[index] = { ...this.nuevoProducto };
      }
    } else {
      // Si no tiene un ID, es un producto nuevo
      const nuevoId = this.productos.length > 0 ? this.productos[this.productos.length - 1].id + 1 : 1;
      const { id, ...restoProducto } = this.nuevoProducto;
      const producto = { id: nuevoId, ...restoProducto };
      this.productos.push(producto);

      // Actualizar categorías si es necesario
      if (!this.categorias.includes(producto.categoria)) {
        this.categorias.push(producto.categoria);
      }
    }

    // Filtrar productos según la categoría seleccionada
    this.filtrarPorCategoria(this.categoriaSeleccionada);

    // Cerrar el modal
    this.cerrarModal();
  }

  onCategoriaSeleccionada(event: any) {
    this.categoriaSeleccionada = event.detail.value; // Actualiza la categoría seleccionada
    this.filtrarPorCategoria(this.categoriaSeleccionada); // Filtra los productos
  }

  // Método para editar un producto
  editarProducto(producto: any) {
    this.nuevoProducto = { ...producto }; // Copia los datos del producto seleccionado
    this.modalAbierto = true; // Abre el modal para editar
  }

  // Método para confirmar la eliminación de un producto
  async confirmarEliminarProducto(producto: any) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: `¿Estás seguro de que deseas eliminar el producto "${producto.descripcion}"?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          handler: () => this.eliminarProducto(producto),
        },
      ],
    });

    await alert.present();
  }

  eliminarProducto(producto: any) {
    // Eliminar el producto de la lista
    this.productos = this.productos.filter((p) => p.id !== producto.id);

    // Actualizar la lista de categorías
    this.categorias = [...new Set(this.productos.map((p) => p.categoria))];

    // Si la categoría seleccionada ya no tiene productos, selecciona la primera categoría disponible
    if (!this.productos.some((p) => p.categoria === this.categoriaSeleccionada)) {
      this.categoriaSeleccionada = this.categorias.length > 0 ? this.categorias[0] : '';
    }

    // Filtrar productos según la nueva categoría seleccionada
    this.filtrarPorCategoria(this.categoriaSeleccionada);
  }

  async mostrarBanner() {
    const options: BannerAdOptions = {
      adId: 'ca-app-pub-6814093303248086/3423228899', // Reemplaza con tu Ad Unit ID
      adSize: BannerAdSize.ADAPTIVE_BANNER,
      position: BannerAdPosition.TOP_CENTER,
      margin: 0,
    };

    await AdMob.showBanner(options);
  }

  async ocultarBanner() {
    await AdMob.hideBanner();
  }
}