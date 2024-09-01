import { Meteor } from 'meteor/meteor';
import { Nodos } from '/Lib/collections'; // Ensure this is after Nodos is defined
import { check } from 'meteor/check';

Meteor.methods({
  'nodos.insert'(nodo) {
    check(nodo, {
      titulo: String,
      descripcion: String,
      imagen: String,
      url: String
    });

    // Aquí puedes agregar verificaciones de seguridad, por ejemplo:
    // if (!this.userId) {
    //   throw new Meteor.Error('not-authorized');
    // }

    return Nodos.insert({
      ...nodo,
      createdAt: new Date(),
      owner: this.userId
    });
  },

  'nodos.remove'(nodoId) {
    check(nodoId, String);

    // Aquí puedes agregar verificaciones de seguridad, por ejemplo:
    // if (!this.userId) {
    //   throw new Meteor.Error('not-authorized');
    // }

    // Verificar si el nodo existe antes de intentar eliminarlo
    const nodo = Nodos.findOne(nodoId);
    if (!nodo) {
      throw new Meteor.Error('not-found', 'El nodo no existe');
    }

    // Verificar si el usuario tiene permiso para eliminar este nodo
    // if (nodo.owner !== this.userId) {
    //   throw new Meteor.Error('not-authorized', 'No tienes permiso para eliminar este nodo');
    // }

    return Nodos.remove(nodoId);
  },

  'nodos.update'(id, updateData) {
    check(id, String);
    check(updateData, {
      titulo: String,
      descripcion: String,
      imagen: String,
      url: String
    });

    // Verificar si el usuario está autenticado
/*     if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'Debe iniciar sesión para editar.');
    } */

    // Opcional: verificar si el usuario tiene permiso para editar este nodo específico
    // const nodo = Nodos.findOne(id);
    // if (nodo.userId !== this.userId) {
    //   throw new Meteor.Error('not-authorized', 'No tiene permiso para editar este nodo.');
    // }

    Nodos.update(id, { $set: updateData });
  }
});

Meteor.publish('nodos', function() {
  return Nodos.find();
});

const insertTask = taskText => Nodos.insert({ text: taskText });

Meteor.startup(() => {

  const tasksData = [
    {
      titulo: "Aprender Meteor",
      fecha: new Date(),
      imagen: "https://d14jjfgstdxsoz.cloudfront.net/assets/meteor-logo.png",
      url: "https://www.meteor.com/",
      descripcion: "Meteor es un framework de JavaScript full-stack para desarrollar aplicaciones web y móviles modernas."
    },
    {
      titulo: "Explorar React",
      fecha: new Date(),
      imagen: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1200px-React-icon.svg.png",
      url: "https://reactjs.org/",
      descripcion: "React es una biblioteca de JavaScript para construir interfaces de usuario."
    },
    {
      titulo: "Dominar MongoDB",
      fecha: new Date(""),
      imagen: "https://webassets.mongodb.com/_com_assets/cms/mongodb_logo1-76twgcu2dm.png",
      url: "https://www.mongodb.com/",
      descripcion: "MongoDB es una base de datos NoSQL orientada a documentos, utilizada comúnmente con aplicaciones Meteor."
    }
  ];

  tasksData.forEach(task => {
    const existingTask = Nodos.findOne({ titulo: task.titulo });
    if (!existingTask) {
      Nodos.insert(task);
    }
  });


  console.log("Datos de ejemplo insertados en la colección TasksCollection");

});


