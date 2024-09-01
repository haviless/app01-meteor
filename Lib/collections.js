import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';

// Required AutoForm setup
SimpleSchema.extendOptions(['autoform']);

const NodoSchema = new SimpleSchema({
  titulo: {
    type: String,
    max: 200
  },
  fecha: {
    type: Date,
    defaultValue: new Date()
  },
  imagen: {
    type: String,
    regEx: SimpleSchema.RegEx.Url,
    optional: true
  },
  url: {
    type: String,
    regEx: SimpleSchema.RegEx.Url,
    optional: true
  },
  descripcion: {
    type: String,
    optional: true,
    max: 1000
  }
}, { tracker: Tracker });


const Nodos = new Mongo.Collection('nodos');

// Attach schema to the collection
Nodos.schema = NodoSchema; // This should work now

// Export the collection
export { Nodos };
