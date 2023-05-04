import "./charSearchForm.scss";
import { useState } from "react";
import * as Yup from "yup";
import useMarvelService from "../../services/MarvelService";
import { Link } from "react-router-dom";
import ErrorMessage from "../errorMessage/ErrorMessage";
import {
  Formik,
  Form,
  Field,
  ErrorMessage as FormikErrorMessage,
} from "formik";

const CharSearchForm = () => {
  const [char, setChar] = useState(null);
  const { loading, error, getCharacterByName, clearError } = useMarvelService();

  console.log(char);

  const updateChar = (name) => {
    clearError();

    getCharacterByName(name).then((char) => setChar(char));
  };

    const errorMessage = error ? (
      <div className="char__search-critical-error">
        <ErrorMessage />
      </div>
    ) : null;

  const result = !char ? null : char.length > 0 ? (
    <div className="char__search-wrapper">
      <div className="char__search-success">
        There is! Visit {char[0].name} page?
      </div>
      <Link
        to={`/characters/${char[0].id}`}
        className="button button__secondary"
      >
        <div className="inner">To page</div>
      </Link>
    </div>
  ) : (
    <div className="char__search-error">
      The character was not found. Check the name and try again
    </div>
  );

  return (
    <div className="char__search-form">
      <Formik
        initialValues={{
          charName: "",
        }}
        validationSchema={Yup.object({
          charName: Yup.string().required("This field is required"),
        })}
        onSubmit={(value) => updateChar(value.charName)}
      >
        <Form>
          <label className="char__search-label" htmlFor="charName">
            Or find a character by name:
          </label>
          <div className="char__search-wrapper">
            <Field
              id="charName"
              name="charName"
              type="text"
              placeholder="Enter name"
            />
            <button type="submit" className="button button__main">
              <div className="inner">find</div>
            </button>
          </div>
          <FormikErrorMessage
            component="div"
            className="char__search-error"
            name="charName"
          />
        </Form>
      </Formik>
      {result}
      {errorMessage}
    </div>
  );
};

export default CharSearchForm;
