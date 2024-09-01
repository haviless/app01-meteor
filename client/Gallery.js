import { Template } from 'meteor/templating';

import 'meteor/aldeed:autoform';
import 'meteor/aldeed:autoform';


import { Nodos } from '/Lib/collections';
import '/client/Gallery.html';

Template.gallery.onCreated(function() {
    this.subscribe('nodos');
  });
  
  Template.gallery.helpers({
    nodos() {
      const searchQuery = Session.get("_searchQuery");
      let query = {};
      if (searchQuery!="") {
        query = {
          $or: [
            { titulo: { $regex: searchQuery, $options: 'i' } },
            { descripcion: { $regex: searchQuery, $options: 'i' } }
          ]
        };
      }
      
      return Nodos.find(query);

    }
  });
  
  Template.gallery.events({
    'click .delete-nodo'(event, instance) {
      event.preventDefault();
      const nodoId = event.currentTarget.getAttribute('data-id');
      
      if (confirm('¿Estás seguro de que quieres eliminar este elemento?')) {
        Meteor.call('nodos.remove', nodoId, (error) => {
          if (error) {
            console.error('Error al eliminar el nodo:', error);
            alert('Hubo un error al eliminar el elemento. Por favor, intenta de nuevo.');
          } else {
            alert('Elemento eliminado con éxito de la galería.');
          }
        });
      }
    },
    'click .nodo-img': function(event, template) {
      const imgSrc = $(event.target).attr('src');
      $('#popupImg').attr('src', imgSrc);
      $('#imagePopup').fadeIn();
    },
    'click .close': function(event, template) {
      $('#imagePopup').fadeOut();
    },
    'click .edit-nodo': function(event, template) {
      const id = $(event.target).data('id');
      const nodo = Nodos.findOne(id);
      if (nodo) {
        $('#edit-id').val(nodo._id);
        $('#edit-titulo').val(nodo.titulo);
        $('#edit-descripcion').val(nodo.descripcion);
        $('#edit-imagen').val(nodo.imagen);
        $('#edit-url').val(nodo.url);
        $('#editItemModal').modal('show');
      }
    },

  });
  
  Template.addItem.onRendered(function() {
    this.$('#addNodoForm').on('submit', function(event) {
      if (!this.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }
      $(this).addClass('was-validated');
    });
    // Colapsar el formulario después de agregar
    Session.set("collapsed",0);
    $('#addItemForm').collapse('hide');
  });
  

Template.addItem.events({
  'submit #add-form'(event, instance) {
    event.preventDefault();
    
    const titulo = event.target.titulo.value;
    const descripcion = event.target.descripcion.value;
    const imagen = event.target.imagen.value;
    const url = event.target.url.value;

    Meteor.call('nodos.insert', { titulo, descripcion, imagen, url }, (error) => {
      if (error) {
        console.error('Error al insertar el nodo:', error);
        alert('Hubo un error al agregar el elemento. Por favor, intenta de nuevo.');
      } else {
        alert('Elemento agregado con éxito a la galería.');
        // Limpiar el formulario
        event.target.reset();
        // Colapsar el formulario después de agregar
        $('#addItemForm').collapse('hide');
      }
    });
  },
    
    'click .btn-expand'(event, instance) {
        event.preventDefault();
        if (Session.get("collapsed")==1) {
            $('#addItemForm').collapse('hide');
            Session.set("collapsed",0);
          } else {
            $('#addItemForm').collapse('show');
            Session.set("collapsed",1);
          }
    },
  });

// Codigo de la barra de busqueda

Template.searchBar.onCreated(function() {
  Session.set("_searchQuery","");
});

Template.searchBar.events({
  'click #searchButton': function(event, template) {
    const searchCriteria = template.$("#searchCriteria").val();
    Session.set("_searchQuery",searchCriteria);
  },
  'click #clearSearch': function(event, template) {
    template.$("#searchCriteria").val('');
    template.searchQuery.set('');
  },
  'keyup #searchCriteria': function(event, template) {
    if (event.keyCode === 13) {  // Enter key
      const searchCriteria = template.$("#searchCriteria").val();
      Session.set("_searchQuery",searchCriteria);
    }
  }
});

Template.editItem.events({
  'submit #edit-form': function(event, template) {
    event.preventDefault();
    const id = $('#edit-id').val();
    const updateData = {
      titulo: $('#edit-titulo').val(),
      descripcion: $('#edit-descripcion').val(),
      imagen: $('#edit-imagen').val(),
      url: $('#edit-url').val()
    };

    Meteor.call('nodos.update', id, updateData, (error) => {
      if (error) {
        console.error("Error al actualizar:", error);
        alert("Hubo un error al actualizar el elemento: " + error.reason);
      } else {
        $('#editItemModal').modal('hide');
        alert("Elemento actualizado con éxito.");
      }
    });
  }
});