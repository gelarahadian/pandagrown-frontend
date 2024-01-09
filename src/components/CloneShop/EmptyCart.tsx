import React from "react";

function EmptyCart() {
  return (
    <>
      <div className="cart-item flex text-center items-center rounded bg-black/5">
        <label className="w-full">Your cart is empty</label>
      </div>
    </>
  )
}

export default EmptyCart;