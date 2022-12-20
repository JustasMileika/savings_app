import React, { useState } from "react";
import { Link } from "react-router-dom";

export const ShoppingCart = (props) => {
  const [isSelectTimeOpen, setIsSelectTimeOpen] = useState(false);
  const [isPathVisible, setIsPathVisible] = useState(false);
    const [isPathFinderReady, setIsPathFinderReady] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrMsg] = useState("");

  console.log(props.cartItems);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log(e.target[0].value);
    console.log(e.target[1].value);
    setIsSelectTimeOpen(false);
  };

  const getFullDate = (fullDate) => {
    const date = new Date(fullDate);
    const minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
    return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}   ${date.getHours()}:${minutes }`;
  };

  const getId = (token) => {
    return JSON.parse(window.atob(token.split(".")[1]))["Id"];
  };
  const MOCK_VISIT = {
    visits: [
      {
        id: "18c866d5-5b17-4a91-8254-50a4edea69af",
        placeId:
          "EjVQaWxhaXTEl3MgZy4gNywgS2Fsb3TElywgS3JldGluZ2FsxJdzIHNlbi4sIExpdGh1YW5pYSIwEi4KFAoSCY918rD62ORGERn3z_4emrH9EAcqFAoSCc307bD62ORGETDs0WCVzhxz",
        startTime: "2022-12-08T21:09:52.6978396+02:00",
        endTime: "2022-12-08T21:19:52.6978549+02:00",
      },
      {
        id: "8d57282a-bfd3-4799-8f5c-aedf0a3245e2",
        placeId: "ChIJN8Gh6Gbc5EYR1jHf05YoU_I",
        startTime: "2022-12-08T21:44:56.3416344+02:00",
        endTime: "2022-12-08T21:54:56.3416374+02:00",
      },
      {
        id: "d4973cb5-fada-4166-8a99-0a6eced8c283",
        placeId: "ChIJx0M0Ok_c5EYRYbVcuWQtmWk",
        startTime: "2022-12-08T22:09:55.2537632+02:00",
        endTime: "2022-12-08T22:13:55.2537676+02:00",
      },
      {
        id: "56110b42-2157-464a-ac26-429723b46f51",
        placeId: "ChIJL9dVGgjc5EYRy-x8d3IU68s",
        startTime: "2022-12-08T23:09:53.9790839+02:00",
        endTime: "2022-12-08T23:16:53.9790902+02:00",
      },
    ],
    length: 0,
    departureTime: "2022-12-08T20:49:07.6978396+02:00",
    duration: 8866.2812506,
    startLocationPlaceId: "ChIJO65fJ1nc5EYRozBD4onXNa4",
  };

  const handlePlanVisits = (e) => {
    e.preventDefault();
    console.log(e.target[0].value);
    console.log(e.target[1].value);

    setIsPathFinderReady(false);
    setIsPathVisible(true);
    setIsSelectTimeOpen(false);

    console.log("ready? " + isPathFinderReady);


    fetch("https://localhost:7183/api/pathfinder", {
      method: "GET",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    }).then(async (res) => {
      console.log(await res.json());
      console.log("ready? " + isPathFinderReady);

      setIsPathFinderReady(true);
      console.log("ready? " + isPathFinderReady);
    });
  };

    const handleCheckout = () => {
        setErrMsg("");

        setLoading(true);
    console.log(props.cartItems);

    const productsToBuy = [];
      props.cartItems.map((cartItem) => {
          console.log(cartItem);
      productsToBuy.push({
        id: cartItem.product.id,
          pickupId: cartItem.pickupTime.id,
          amount: cartItem.unitQuantity,
      });
    });

    console.log(
      JSON.stringify({
        productsToBuy: productsToBuy,
        buyerId: getId(localStorage.getItem("token")),
      })
    );

    console.log(productsToBuy);
    fetch("https://localhost:7183/api/shop/checkout", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("token")
      },
      body: JSON.stringify({
        productsToBuy: productsToBuy,
        buyerId: getId(localStorage.getItem("token")),
      }),
    }).then(async response => {

        const json = await response.json();
        console.log(json);

        if (!response.ok) {
            return Promise.reject(json);
        }


        props.setSnackMessage("Order created successfully");
        props.setSnackOn(true);
        setLoading(false);

    })
        .catch(error => {
            setLoading(false);
            setErrMsg(error.title);
        })

    props.setCartItems([]);
    props.setFullSum(0);
  };

  return (
    <>
      <div className="flex w-full h-full">
              <div className="bg-white w-2/3 p-16 flex flex-col relative">
                  <p className="text-red-500">{errorMsg}</p>
          <h1 className="text-2xl font-bold text-sky-500">MY SHOPPING CART</h1>
          <div className="bg-sky-500 h-1"></div>
          <div className="flex justify-between pt-5">
            <p className="text-black">PRODUCT</p>
            <div className="flex gap-20 text-zinc-500">
              <p className="font-bol text-black">TOTAL</p>
            </div>
          </div>
          <div className="bg-sky-500 h-0.5 mb-3"></div>
          <div className="flex flex-col gap-4">
            {props.cartItems.length > 0 ? (
              props.cartItems.map((cartItem, index) => {
                return (
                  <>
                    <div className="flex justify-between border-b-2 border-sky-500 pb-2">
                      <div className="flex gap-5">
                        <img
                                    src={cartItem.product.imageUrl == null ?
                                        "https://savingsapp.blob.core.windows.net/productimages/foodDefault.jpg" :
                                        cartItem.product.imageUrl}
                          className="w-24 h-20 rounded-md border-zinc-500 border-2"
                        />
                        <div className="flex flex-col">
                          <h1 className="font-bold italic text-sky-500 text-xl tracking-wide">
                            {cartItem.itemName}
                          </h1>
                          <div className="flex gap-1 items-center">
                            <h3 className="font-bold text-md text-sky-500">Pickup Time: </h3>
                            <p className="text-sm">
                              {getFullDate(cartItem.pickupTime.startTime)} to{" "}
                              {getFullDate(cartItem.pickupTime.endTime)}
                            </p>
                          </div>
                          <div className="flex gap-1 items-center">
                            <h3 className="font-bold text-md text-sky-500">Quantity: </h3>
                            <p className="text-sm">
                              {cartItem.quantity} {cartItem.quantityType}
                            </p>
                          </div>
                          <button
                                        className="self-start text-sm text-zinc-500"
                                        onClick={() => {
                                            props.removeCartItem(index);
                                            props.setSnackOn(true);
                                            props.setSnackMessage("Product removed from cart");
                                        }}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                      <div className="bg-sky-500 h-0.5 my-3"></div>
                      <p className="font-bold self-center text-sky-500">
                        {cartItem.fullPrice} Eur
                      </p>
                    </div>
                  </>
                );
              })
            ) : (
              <div className="flex flex-col items-center gap-3">
                <h1 className="text-center text-sky-500 font-bold pt-10 text-2xl">
                  Your Shopping Cart Is Empty
                </h1>
                <Link to="/">
                  <button className="px-5 py-2 bg-sky-500 hover:font-bold text-white text-lg">
                    SHOP
                  </button>
                </Link>
              </div>
            )}
            
           
          </div>
        </div>
        <div className="bg-sky-500 w-1/3 min-h-screen p-10 pt-24 flex flex-col justify-between">
          <div>
            <h1 className="text-2xl text-white">Summary</h1>
            <div className="bg-white h-1 mt-2"></div>
          </div>
          <div className="pb-24 flex flex-col gap-2">
            <div className="flex justify-between justify-self-end items-center">
              <h1 className="text-white text-2xl ">Total </h1>
              <h1 className="font-bold text-white text-2xl">
                {props.fullSum} Eur
              </h1>
            </div>
            <div className="bg-white h-1 mb-2"></div>

            <button
                          type="button"
                          className="bg-white p-2 pt-2 font-bold justify-self-end mb-2"
                          onClick={handleCheckout}
                          disabled={loading }
                      >


                          <>

                              {loading && <div>
                                  <i
                                      className="fa fa-refresh fa-spin"

                                  />
                              </div>}
                              Checkout


                          </>
            </button>
           
          </div>
        </div>
      </div>
    </>
  );
};

export default ShoppingCart;
