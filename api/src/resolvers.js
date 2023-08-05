/**
 * Here are your Resolvers for your Schema. They must match
 * the type definitions in your scheama
 */

module.exports = {
  Query: {
    pets(_, { input }, ctx) {
      console.log("Query", "Pets");
      return ctx.models.Pet.findMany(input);
    },

    pet(_, { input }, ctx) {
      console.log("Query", "Pet");
      return ctx.models.Pet.findOne(input);
    },
    user(_, __, ctx) {
      console.log("Query", "User");
      return ctx.models.User.findOne();
    },
  },
  Mutation: {
    createPet(_, { input }, ctx) {
      return ctx.models.Pet.create(input);
    },
  },
  Pet: {
    user(pet, _, ctx) {
      console.log("PET", pet);
      return ctx.models.User.findOne();
    },
  },
  User: {
    pets(user, _, ctx) {
      console.log("User", user);
      return ctx.models.Pet.findMany();
    },
  },
};
