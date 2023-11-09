import React, { useState } from "react";
import { nanoid } from "nanoid";
import { getDatabase, child, ref, set, get } from "firebase/database";
import { isWebUri } from "valid-url";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

const Form = () => {
  const [shortURL, setShortURL] = useState("");
  const [longURL, setLongURL] = useState("");
  const [preferedAlias, setPreferedAlias] = useState("");
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState([]);
  const [errorMessage, setErrorMessage] = useState({});
  const [toolTipMessage, setToolTipMessage] = useState("Copy To Clip Board");

  const onLongURLChangeHandler = (e) => {
    setLongURL(e.target.value);
  };
  const onPreferedAliasChangeHandler = (e) => {
    setPreferedAlias(e.target.value);
  };
  const onSubmit = async (e) => {
    // if (preferedAlias === "") {
    //   setShortURL("linkini.com/" + nanoid(5));
    // } else {
    //   setShortURL("linkini.com/" + preferedAlias);
    // }
    //setShow(true);
    const isFormValid = await validateInput();
    console.log(isFormValid);
    if (isFormValid) {
      const generatedKey = preferedAlias !== "" ? preferedAlias : nanoid(5);
      const generatedURL = "linkini.com/" + generatedKey;
      const db = getDatabase();
      try {
        await set(ref(db, "/" + generatedKey), {
          generatedKey: generatedKey,
          longURL: longURL,
          preferedAlias: preferedAlias,
          generatedURL: generatedURL,
        }).then((result) => {
          setShortURL(generatedURL);
          setShow(false);
        });
        // Handle success
      } catch (error) {
        // Handle error
        console.error("Error saving data to Firebase:", error);
      }
    } else {
      return;
    }
  };
  const checkKeyExists = async () => {
    const dbRef = ref(getDatabase());
    return get(child(dbRef, `/${preferedAlias}`)).catch((error) => {
      return false;
    });
  };
  const copyToClipBoard = () => {
    navigator.clipboard.writeText(shortURL);
    setToolTipMessage("Copied!");
  };
  const validateInput = async () => {
    var error = [];
    var errorMessages = errorMessage;

    //Validate Long URL
    if (longURL.length === 0) {
      error.push("longURL");
      errorMessages["longURL"] = "Please enter your URL!";
    } else if (!isWebUri(longURL)) {
      error.push("longURL");
      errorMessages["longURL"] =
        "Please enter a URL in the form of https://www....";
    }
    //Prefered Alias
    if (preferedAlias !== "") {
      if (preferedAlias.length > 7) {
        error.push("suggestedAlias");
        errorMessages["suggestedAlias"] =
          "Please Enter an Alias less than 7 Characters";
      } else if (preferedAlias.indexOf(" ") >= 0) {
        error.push("suggestedAlias");
        errorMessages["suggestedAlias"] = "Spaces are not allowed in URLS";
      }

      var keyExists = await checkKeyExists();

      if (keyExists.exists()) {
        error.push("suggestedAlias");
        errorMessages["suggestedAlias"] =
          "The Alias you have entered already exists! Please enter another one)";
      }
    }
    setErrors(error);
    setErrorMessage(errorMessages);
    setShow(true);

    if (error.length > 0) {
      return false;
    }
    return true;
  };

  const hasError = (key) => {
    return errors.indexOf(key) !== -1;
  };
  return (
    <div className='container'>
      <form>
        <div className='form-group'>
          <label htmlFor='longURL'>Long URL</label>
          <input
            type='url'
            className='form-control'
            id='longURL'
            onChange={onLongURLChangeHandler}
            value={longURL}
            aria-describedby='urlHelp'
            placeholder='https://www....'
          />
        </div>
        <div
          className={hasError("longURL") ? "text-danger" : "visually-hidden"}
        >
          {errorMessage.longURL}
        </div>
        <div className='form-group'>
          <label htmlFor='alias'>Prefered Alias</label>
          <div className='input-group mb3'>
            <div className='input-group-text'>
              <span>linkini.com/</span>
            </div>
            <input
              type='text'
              value={preferedAlias}
              onChange={onPreferedAliasChangeHandler}
              className='form-control'
              placeholder='Ex: s4Xs1 (Optional)'
            />
          </div>
          <div
            className={
              hasError("suggestedAlias") ? "text-danger" : "visually-hidden"
            }
          >
            {errorMessage.suggestedAlias}
          </div>
        </div>
      </form>
      <button className='btn btn-primary' type='button' onClick={onSubmit}>
        {show ? (
          <div>
            <span
              className='spinner-border spinner-border-sm'
              role='status'
              aria-hidden='true'
            ></span>
          </div>
        ) : (
          <div>
            <span
              className='visually-hidden spinner-border spinner-border-sm'
              role='status'
              aria-hidden='true'
            ></span>
            <span>Linkini</span>
          </div>
        )}
      </button>
      {shortURL === "" ? (
        <div></div>
      ) : (
        <div className='generatedurl'>
          <span>Your generated URL is: </span>
          <div className='input-group mb-3'>
            <input
              disabled
              type='text'
              value={shortURL}
              className='form-control'
              placeholder="Recipient's username"
              aria-label="Recipient's username"
              aria-describedby='basic-addon2'
            />
            <div className='input-group-append'>
              <OverlayTrigger
                key={"top"}
                placement={"top"}
                overlay={
                  <Tooltip id={`tooltip-${"top"}`}>{toolTipMessage}</Tooltip>
                }
              >
                <button
                  onClick={() => copyToClipBoard()}
                  data-toggle='tooltip'
                  data-placement='top'
                  title='Tooltip on top'
                  className='btn btn-outline-secondary'
                  type='button'
                >
                  Copy
                </button>
              </OverlayTrigger>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Form;
