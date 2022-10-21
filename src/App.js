import React, { useEffect, useState } from 'react';
import Alert from './Alert';
import List from './List';
const getLocalStorage = () => {
  let list = localStorage.getItem('list');
  if (list) return JSON.parse(localStorage.getItem('list'));
  else return [];
};
function App() {
  const [name, setName] = useState('');
  const [list, setList] = useState(getLocalStorage());
  const [isEditing, setEditing] = useState(false);
  const [editID, setEditID] = useState(null);
  const [warning, setWarning] = useState({
    show: false,
    msg: '',
    type: '',
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) showAlert(true, 'danger', 'Please enter value');
    else if (name && isEditing) {
      setList(
        list.map((item) => {
          if (item.id === editID) {
            return { ...item, title: name };
          }
          return item;
        })
      );
      setName('');
      setEditID(null);
      setEditing(false);
      showAlert(true, 'success', 'Item Changed!');
    } else {
      const newItem = { id: new Date().getTime().toString(), title: name };
      setList([...list, newItem]);
      setName('');
      showAlert(true, 'success', 'Item add to the list!');
    }
  };
  const showAlert = (show = false, type = '', msg = '') => {
    setWarning({ show, type, msg });
  };
  const clearList = () => {
    setList([]);
    showAlert(true, 'danger', 'Empty list!');
  };
  const removeItem = (id) => {
    const newItem = list.filter((items) => items.id !== id);
    setList(newItem);
    showAlert(true, 'danger', 'Item removed!');
  };
  const editItem = (id) => {
    const specificItem = list.find((item) => item.id === id);
    setEditing(true);
    setEditID(id);
    setName(specificItem.title);
  };
  useEffect(() => {
    localStorage.setItem('list', JSON.stringify(list));
  }, [list]);

  return (
    <section className='section-center'>
      <form className='grocery-form' onSubmit={handleSubmit}>
        {warning.show && (
          <Alert {...warning} removeAlert={showAlert} list={list} />
        )}
        <h3>Grocery bud</h3>
        <div className='form-control'>
          <input
            type='text'
            className='grocery'
            placeholder='e.g. eggs'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button type='submit' className='submit-btn'>
            {isEditing ? 'Edit' : 'Submit'}
          </button>
        </div>
      </form>
      {list.length > 0 && (
        <div className='grocery-container'>
          <List items={list} removeItem={removeItem} editItem={editItem} />
          <button className='clear-btn' type='submit' onClick={clearList}>
            clear items
          </button>
        </div>
      )}
    </section>
  );
}

export default App;
