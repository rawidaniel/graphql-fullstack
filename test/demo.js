const gql = require("graphql-tag");
const { ApolloServer } = require("apollo-server");

const typeDefs = gql`
  enum ShoeType {
    JORDAN
    NIKE
    ADIDDAS
  }

  type User {
    email: String!
    avatar: String!
    shoes: [Shoes]!
  }

  interface Shoes {
    brand: ShoeType!
    size: Int!
    user: User!
  }

  type Sneaker implements Shoes {
    brand: ShoeType!
    size: Int!
    user: User!
    sport: String
  }

  type Boot implements Shoes {
    brand: ShoeType!
    size: Int!
    user: User!
    isGrip: Boolean
  }

  union Footware = Sneaker | Boot
  input ShoesInput {
    brand: ShoeType
    size: Int
  }

  input newShoe {
    brand: ShoeType!
    size: Int!
  }

  type Query {
    me: User!
    shoes(input: ShoesInput): [Shoes]!
  }

  type Mutation {
    newShoe(input: newShoe): Shoes!
  }
`;

const user = {
  id: 1,
  email: "test@gmail.com",
  avatar: "https://www.google.com",
  shoes: [],
};

const shoes = [
  { brand: "NIKE", size: 12, sport: "running" },
  { brand: "ADIDDAS", size: 13, isGrip: true },
];

const resolvers = {
  Query: {
    me() {
      return {
        email: "test@gmail.com",
        avatar: "https://www.google.com",
      };
    },
    shoes(_, { input }) {
      if (input?.brand || input?.size) {
        return shoes.filter((shoe) => shoe.brand === input.brand);
      } else {
        return shoes;
      }
    },
  },
  Mutation: {
    newShoe(_, { input }) {
      return input;
    },
  },

  User: {
    shoes() {
      return shoes;
    },
  },

  Shoes: {
    __resolveType(shoes) {
      if (shoes.sport) return "Sneaker";
      return "Boot";
    },
  },

  Footware: {
    __resolveType(shoes) {
      if (shoes.sport) return "Sneaker";
      return "Boot";
    },
  },

  Sneaker: {
    user(shoe) {
      console.log("Sneaker", shoe);
      return user;
    },
  },

  Boot: {
    user(shoe) {
      console.log("Boot", shoe);
      return user;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
