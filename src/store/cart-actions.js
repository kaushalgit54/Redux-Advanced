import CartItem from "../components/Cart/CartItem";
import { cartSliceActions } from "./cart-slice";
import { uiSliceActions } from "./ui-slice";

export const fetchCartData = ()=>{
    return async (dispatch) => {
      const fetchData = async ()=>{
         const response = await fetch(`https://book-db-42639-default-rtdb.asia-southeast1.firebasedatabase.app/cart.json`);
         
         if(!response.ok){
            throw new Error('Could not fetch the data!');
         }
         const data = await response.json();
         return data;
      };
      try {
        const cartData = await fetchData();
         dispatch(cartSliceActions.replaceCart({
            items: cartData.items || [],
            totalQuantity: cartData.totalQuantity
         }));
      } catch (error) {
        dispatch(
            uiSliceActions.showNotification({
              status: "error",
              title: "Error!",
              message: "Fetching cart data failed!",
            })
          );
      }   
    };
}
export const sendCartData = (cart) => {
    return async (dispatch) => {
      dispatch(
        uiSliceActions.showNotification({
          status: "pending",
          title: "Sending...",
          message: "Sending cart data!",
        })
      );
      //This is action creator that returns the functions 
      const sendRequest = async () => {
        const response = await fetch(
          "https://book-db-42639-default-rtdb.asia-southeast1.firebasedatabase.app/cart.json",
          {
            method: "PUT",
            body: JSON.stringify({
                items: cart.items,
                totalQuantity: cart.totalQuantity,
            }),
          }
        );
  
        if (!response.ok) {
          throw new Error("Sending cart data failed.");
        }
      };
  
      try {
        await sendRequest();
        dispatch(
          uiSliceActions.showNotification({
            status: "success",
            title: "Success!",
            message: "Sent cart data successfully!",
          })
        );
      } catch (error) {
        dispatch(
          uiSliceActions.showNotification({
            status: "error",
            title: "Error!",
            message: "Sending cart data failed!",
          })
        );
      }
    };
  };
  