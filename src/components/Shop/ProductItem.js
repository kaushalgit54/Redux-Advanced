import { useDispatch, useSelector } from 'react-redux';

import { cartSliceActions } from '../../store/cart-slice';
import Card from '../UI/Card';
import classes from './ProductItem.module.css';

const ProductItem = (props) => {
  const dispatch = useDispatch();
  const cart = useSelector((state) =>state.cart);
  
  const { title, price, description, id } = props;

  const addToCartHandler = () => {
    //We should not manipulate states in comonents of redux instead we should write a helper function and call here to manipulate in reducer functions
    
    const newTotalQuantity = cart.totalQuantity + 1;
    //Create copy of items array via slice method to avoid mutating original states
    const updatedItems = cart.items.slice(); //The slice() method is a copying method. It does not alter this but instead returns a shallow copy that contains some of the same elements as the ones from the original array.
    const existingItem = updatedItems.find((item) => item.id === id);   //find() method finds one element and return it as soon as according to given condition the array is passed
    //Here existingItem is returning only one object from the items array

    //If current item already exists in the array then update its quantity and price
    //or if items array is not empty
    if(existingItem){
      //new object  + copy existing properties to avoid state mutation
      //Copy existingitem object into updatedItem object
      const updatedItem = {...existingItem};
      updatedItem.quantity++;
      updatedItem.totalPrice += price;
      //After updating this object find the last index of the updatedItems array so that updatedItems object will be inserted into that index

      const existingItemIndex = updatedItems.findIndex((item) => item.id === id);
      //Now insert updatedItem object into last index
      updatedItems[existingItemIndex] = updatedItem;
    }
    //else push new item in the array and its attributes that is id, price, quantity, totalPrice, name 
    else{
      updatedItems.push({
        id: id,
        price: price,
        quantity: 1,
        totalPrice: price,
        name: title,
      });
    }
    
    //Now replace the cart in reducer function with current mutated cart
    const newCart = {
      totalQuantity: newTotalQuantity,
      items: updatedItems,
    };

    // Now dispatch the action to replace the cart
    dispatch(cartSliceActions.replaceCart(newCart));
    
    //Then send http request here
    // fetch('firebase-url',{
    //    method: 'POST',
    //    body: JSON.stringify(newCart)
    // });

    // dispatch(
    //   cartSliceActions.addItemToCart({
    //     id,
    //     title,
    //     price,
    //   })
    // );
  };

  return (
    <li className={classes.item}>
      <Card>
        <header>
          <h3>{title}</h3>
          <div className={classes.price}>${price.toFixed(2)}</div>
        </header>
        <p>{description}</p>
        <div className={classes.actions}>
          <button onClick={addToCartHandler}>Add to Cart</button>
        </div>
      </Card>
    </li>
  );
};

export default ProductItem;
