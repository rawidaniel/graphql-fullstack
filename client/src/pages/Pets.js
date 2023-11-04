import React, { useState } from "react";
import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/react-hooks";
import PetsList from "../components/PetsList";
import NewPetModal from "../components/NewPetModal";
import Loader from "../components/Loader";

const PETS_FILEDS = gql`
  fragment PetsFields on Pet {
    id
    name
    img
    type
    vaccinated @client
    owner {
      id
      age @client
    }
  }
`;
const PETS_QUERY = gql`
  query PetsQuery {
    pets {
      ...PetsFields
    }
  }
  ${PETS_FILEDS}
`;

const CREAT_PET = gql`
  mutation AddPet($input: NewPetInput!) {
    addPet(input: $input) {
      ...PetsFields
    }
  }
  ${PETS_FILEDS}
`;

export default function Pets() {
  const [modal, setModal] = useState(false);
  const { data, loading, error } = useQuery(PETS_QUERY);
  const [createPet, newPet] = useMutation(CREAT_PET, {
    update(cache, { data: { addPet } }) {
      const { pets } = cache.readQuery({ query: PETS_QUERY });
      cache.writeQuery({
        query: PETS_QUERY,
        data: { pets: [addPet, ...pets] },
      });
    },
  });

  const onSubmit = (input) => {
    setModal(false);
    createPet({
      variables: { input },
      optimisticResponse: {
        __typename: "Mutation",
        addPet: {
          __typename: "Pet",
          id: Math.floor(Math.random() * 100) + "",
          name: input.name,
          img: "https://via.placeholder.com/300",
          type: input.type,
        },
      },
    });
  };

  if (loading) {
    return <Loader />;
  }

  if (error || newPet.error) {
    return <p>error!</p>;
  }

  if (modal) {
    return <NewPetModal onSubmit={onSubmit} onCancel={() => setModal(false)} />;
  }

  console.log("data", data.pets[0]);

  return (
    <div className="page pets-page">
      <section>
        <div className="row betwee-xs middle-xs">
          <div className="col-xs-10">
            <h1>Pets</h1>
          </div>

          <div className="col-xs-2">
            <button onClick={() => setModal(true)}>new pet</button>
          </div>
        </div>
      </section>
      <section>
        <PetsList pets={data.pets} />
      </section>
    </div>
  );
}
