import React, { useState, useContext } from 'react';

import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';
import Modal from '../../shared/components/UIElements/Modal';
import Map from '../../shared/components/UIElements/Map';
import { AuthContext } from '../../shared/context/auth-context';
import './PlaceItem.css';

const PlaceItem = (props) => {
  const auth = useContext(AuthContext);
  const [isMapShowing, setMapShowing] = useState(false);
  const [isConfirmModalShowing, setConfirmModalShowing] = useState(false);

  const openMap = () => setMapShowing(true);
  const closeMap = () => setMapShowing(false);
  const showDeleteWarning = () => setConfirmModalShowing(true);
  const cancelDelete = () => setConfirmModalShowing(false);
  const confirmDelete = () => {
    setConfirmModalShowing(false);
    console.log('deleting...');
  };

  return (
    <React.Fragment>
      {/* map modal */}
      <Modal
        show={isMapShowing}
        onCancel={closeMap}
        header={props.address}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        footer={<Button onClick={closeMap}>CLOSE</Button>}
      >
        <div className="map-container">
          <Map center={props.coordinates} zoom={16}></Map>
        </div>
      </Modal>
      {/* delete confirmation modal */}
      <Modal
        show={isConfirmModalShowing}
        onCancel={cancelDelete}
        header="Are you sure?"
        footerClass="place-item__modal--actions"
        footer={
          <>
            <Button inverse onClick={cancelDelete}>
              CANCEL
            </Button>
            <Button danger onClick={confirmDelete}>
              DELETE
            </Button>
          </>
        }
      >
        <p>
          Do you want to proceed and delete this place? You CANNOT UNDO this
          action.
        </p>
      </Modal>
      <li className={`place-item ${props.className}`} style={props.style}>
        <Card className="place-item__content">
          <div className="place-item__image">
            <img src={props.image} alt={props.title} />
          </div>
          <div className="place-item__info">
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p>{props.description}</p>
          </div>
          <div className="place-item__actions">
            <Button inverse onClick={openMap}>
              VIEW ON MAP
            </Button>
            {auth.isLoggedIn && (
              <Button to={`/places/${props.id}`}>EDIT</Button>
            )}
            {auth.isLoggedIn && (
              <Button danger onClick={showDeleteWarning}>
                DELETE
              </Button>
            )}
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
};

export default PlaceItem;
