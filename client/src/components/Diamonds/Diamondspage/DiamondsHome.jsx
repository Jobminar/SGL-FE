import React, { useState, useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Beadssidebar from "../../Filterssidebar/beadssidebar";
import CartSidebar from "../../CartSideNav";

const DiamondsHome = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [isCartSidebarOpen, setCartSidebarOpen] = useState(false);
  const [diamonds, setDiamonds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDiamonds = async () => {
      try {
        const response = await fetch("https://sgl-be.onrender.com/getdiamonds");
        if (response.ok) {
          const data = await response.json();
          setDiamonds(data);
          setIsLoading(false);
        } else {
          // Handle non-OK responses
          const errorMessage = await response.text();
          console.error(
            `Failed to fetch Pearls. Server response: ${errorMessage}`
          );
          setIsLoading(false);
        }
      } catch (error) {
        // Handle network errors or JSON parsing errors
        console.error("Error fetching diamonds:", error.message);
        setIsLoading(false);
      }
    };

    fetchDiamonds();
  }, []);

  const handleCardClick = (clickedItem) => {
    setSelectedItem(clickedItem);
    setCartSidebarOpen(true);
  };

  const calculateQuantity = (item) => item.quantity || 1;

  const closeCartSidebar = () => {
    setSelectedItem(null);
    setCartSidebarOpen(false);
  };

  return (
    <div className="pearlshome-container">
      {isLoading && (
        <div className="loading-container">
          <CircularProgress />
        </div>
      )}

      {!isLoading && (
        <div className="peralshome-main-con">
          <div className="perals-side-nav">
            <Beadssidebar />
          </div>
          <div className="perals-map-area">
            <div className="beadsmain-con">
              {diamonds.map((item, index) => (
                <div key={index}>
                  <div
                    className={`beads-box ${
                      selectedItem === item ? "selected" : ""
                    }`}
                    onClick={() => handleCardClick(item)}
                  >
                    <img
                      src={`data:image/png;base64,${item.image}`}
                      alt="jewelry"
                      width="50%"
                      height="50%"
                      className="beads-image"
                    />
                    <p className="pearlsname">{item.name}</p>
                    <h4 className="item-price">{item.price}</h4>
                    <button className="buy-now-button">View Product</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {selectedItem && (
        <CartSidebar
          isOpen={isCartSidebarOpen}
          onClose={closeCartSidebar}
          selectedItem={selectedItem.name}
          quantity={calculateQuantity(selectedItem)}
          itemData={selectedItem} // Pass itemData here
        />
      )}
    </div>
  );
};
export default DiamondsHome;
