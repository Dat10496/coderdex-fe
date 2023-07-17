import Box from '@mui/material/Box';
import { FormProvider, FTextField } from './form';
import Modal from '@mui/material/Modal';

import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from "react-redux";
import { alpha, Stack } from "@mui/material";
import { LoadingButton } from "@mui/lab";

import { addPokemon } from "../features/pokemons/pokemonSlice";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function PokemonModal({ open, setOpen }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [nameValue, setNameValue] = useState("");
  const [idValue, setIdValue] = useState("");
  const [urlValue, setUrlValue] = useState("");
  const [type1Value, setType1Value] = useState("");
  const [type2Value, setType2Value] = useState("");

  const defaultValues = {
    name: nameValue,
    id: idValue,
    imgUrl: urlValue,
    types: [type1Value, type2Value],
  };

  const { isSuccess } = useSelector((state) => state.pokemons);

  const methods = useForm(defaultValues);

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleNaviGate = () => {
    console.log(isSuccess);
    if (isSuccess) navigate(`/pokemons/${idValue}`);
    console.log("tesst");
  };

  const onSubmit = () => {
    dispatch(addPokemon(defaultValues))
      .then(() => setOpen(false))
      .then(() => handleNaviGate());

    setNameValue("");
    setIdValue("");
    setUrlValue("");
    setType1Value("");
    setType2Value("");
  };

  const handleClose = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
              <FTextField
                value={nameValue}
                onChange={(e) => setNameValue(e.target.value)}
                name="name"
                fullWidth
                rows={4}
                placeholder="Name"
                sx={{
                  "& fieldset": {
                    borderWidth: `1px !important`,
                    borderColor: alpha("#919EAB", 0.32),
                  },
                }}
              />
              <FTextField
                value={idValue}
                onChange={(e) => setIdValue(e.target.value)}
                name="id"
                fullWidth
                rows={4}
                placeholder="Id"
                sx={{
                  "& fieldset": {
                    borderWidth: `1px !important`,
                    borderColor: alpha("#919EAB", 0.32),
                  },
                }}
              />
              <FTextField
                value={urlValue}
                onChange={(e) => setUrlValue(e.target.value)}
                name="url"
                fullWidth
                placeholder="Image Url"
                sx={{
                  "& fieldset": {
                    borderWidth: `1px !important`,
                    borderColor: alpha("#919EAB", 0.32),
                  },
                }}
              />
              <FTextField
                value={type1Value}
                onChange={(e) => setType1Value(e.target.value)}
                name="type1"
                fullWidth
                rows={4}
                placeholder="Type 1"
                sx={{
                  "& fieldset": {
                    borderWidth: `1px !important`,
                    borderColor: alpha("#919EAB", 0.32),
                  },
                }}
              />
              <FTextField
                value={type2Value}
                onChange={(e) => setType2Value(e.target.value)}
                name="type2"
                fullWidth
                rows={4}
                placeholder="Type 2"
                sx={{
                  "& fieldset": {
                    borderWidth: `1px !important`,
                    borderColor: alpha("#919EAB", 0.32),
                  },
                }}
              />

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                }}
              >
                <LoadingButton
                  type="submit"
                  variant="contained"
                  size="small"
                  loading={isSubmitting}
                >
                  Create Pokemon
                </LoadingButton>
              </Box>
            </Stack>
          </FormProvider>
        </Box>
      </Modal>
    </div>
  );
}
