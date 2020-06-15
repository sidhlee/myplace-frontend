import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';
import Modal from '../../shared/components/UIElements/Modal';
import Map from '../../shared/components/UIElements/Map';
import { AuthContext } from '../../shared/context/auth-context';
import { useHttpClient } from '../../shared/hooks/http-hook';
import './PlaceItem.css';
import ErrorModal from 'shared/components/UIElements/ErrorModal';
import LoadingSpinner from 'shared/components/UIElements/LoadingSpinner';

const PlaceItem = (props) => {
  const { sendRequest, isLoading, error, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
  const [isMapShowing, setMapShowing] = useState(false);
  const [isConfirmModalShowing, setConfirmModalShowing] = useState(false);

  const openMap = () => setMapShowing(true);

  const closeMap = () => setMapShowing(false);

  const showDeleteWarning = () => setConfirmModalShowing(true);

  const cancelDelete = () => setConfirmModalShowing(false);

  const confirmDelete = async () => {
    // You need to close the confirm modal before sending request so that
    // when error modal opens up there won't be two modals opened up at the same time
    setConfirmModalShowing(false);
    try {
      await sendRequest(
        `http://localhost:5000/api/places/${props.id}`,
        'DELETE',
        null,
        {
          Authorization: 'Bearer ' + auth.token,
        }
      );
    } catch (err) {}
    props.onDelete(props.id);
    console.log('deleting...');
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
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
        footerClass="place-item__modal-actions"
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
      {/* Main place card */}
      <li className={`place-item ${props.className}`} style={props.style}>
        <Card className="place-item__content">
          {/* Confirm modal is closed when clicked on either cancel/delete */}
          {/* Therefore the spinner is going to be on the item that's being deleted */}
          {isLoading && <LoadingSpinner asOverlay />}
          <div className="place-item__image">
            <img
              src={`http://localhost:5000/${props.image}`}
              alt={props.title}
            />
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
            {auth.userId === props.creatorId && (
              <Button to={`/places/${props.id}`}>EDIT</Button>
            )}
            {auth.userId === props.creatorId && (
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

PlaceItem.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  coordinates: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
  }).isRequired,
  // id of the user who created this place
  creatorId: PropTypes.string.isRequired,
  // id of this place item
  id: PropTypes.string.isRequired,
};

export default PlaceItem;
