import React, { useState } from 'react';
import { ChefHat, Wine, Pizza, Coffee, Salad, ShoppingCart, Plus, Minus, X, Clock } from 'lucide-react';

type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  preparationTime?: string;
  spicyLevel?: number;
  isVegetarian?: boolean;
  isGlutenFree?: boolean;
};

type MenuSection = {
  title: string;
  icon: React.ReactNode;
  items: MenuItem[];
};

type CartItem = {
  item: MenuItem;
  quantity: number;
  observations?: string;
};

function formatPrice(price: number): string {
  return `R$ ${price.toFixed(2)}`;
}

function App() {
  const [activeCategory, setActiveCategory] = useState<number>(0);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [itemObservation, setItemObservation] = useState("");

  const menuSections: MenuSection[] = [
    {
      title: "Entradas",
      icon: <Salad className="w-6 h-6" />,
      items: [
        {
          id: "1",
          name: "Bruschetta Clássica",
          description: "Pão italiano grelhado com tomate fresco, manjericão e azeite de oliva",
          price: 28,
          preparationTime: "15 min",
          isVegetarian: true
        },
        {
          id: "2",
          name: "Carpaccio de Berinjela",
          description: "Finas fatias de berinjela assada, queijo parmesão e rúcula",
          price: 32,
          preparationTime: "20 min",
          isVegetarian: true,
          isGlutenFree: true
        },
        {
          id: "3",
          name: "Bolinhos de Queijo",
          description: "Deliciosos bolinhos de queijo derretido com molho de pimenta suave",
          price: 26,
          preparationTime: "25 min",
          isVegetarian: true,
          spicyLevel: 1
        }
      ]
    },
    {
      title: "Pizzas Clássicas",
      icon: <Pizza className="w-6 h-6" />,
      items: [
        {
          id: "4",
          name: "Margherita",
          description: "Molho de tomate, mussarela fresca, manjericão e azeite de oliva",
          price: 45,
          preparationTime: "30 min",
          isVegetarian: true
        },
        {
          id: "5",
          name: "Pepperoni",
          description: "Molho de tomate, mussarela e pepperoni fatiado",
          price: 52,
          preparationTime: "30 min",
          spicyLevel: 2
        },
        {
          id: "6",
          name: "Quatro Queijos",
          description: "Mussarela, gorgonzola, parmesão e provolone",
          price: 54,
          preparationTime: "30 min",
          isVegetarian: true
        }
      ]
    },
    {
      title: "Pizzas Especiais",
      icon: <ChefHat className="w-6 h-6" />,
      items: [
        {
          id: "7",
          name: "Trufada",
          description: "Molho de trufa, mussarela de búfala, cogumelos e rúcula",
          price: 68,
          preparationTime: "35 min",
          isVegetarian: true
        },
        {
          id: "8",
          name: "Mediterrânea",
          description: "Tomate seco, azeitonas pretas, mussarela, rúcula e queijo feta",
          price: 62,
          preparationTime: "35 min",
          isVegetarian: true
        },
        {
          id: "9",
          name: "Calabresa Artesanal",
          description: "Calabresa artesanal, cebola roxa, mussarela e orégano",
          price: 58,
          preparationTime: "35 min",
          spicyLevel: 1
        }
      ]
    },
    {
      title: "Bebidas",
      icon: <Wine className="w-6 h-6" />,
      items: [
        {
          id: "10",
          name: "Vinho Tinto da Casa",
          description: "Garrafa 750ml",
          price: 89,
          isGlutenFree: true
        },
        {
          id: "11",
          name: "Cerveja Artesanal",
          description: "IPA, Pilsen ou Weiss - 500ml",
          price: 24
        },
        {
          id: "12",
          name: "Refrigerante Artesanal",
          description: "Diversos sabores - 355ml",
          price: 12,
          isGlutenFree: true
        }
      ]
    },
    {
      title: "Sobremesas",
      icon: <Coffee className="w-6 h-6" />,
      items: [
        {
          id: "13",
          name: "Tiramisù",
          description: "Clássica sobremesa italiana com café e mascarpone",
          price: 32,
          preparationTime: "10 min",
          isVegetarian: true
        },
        {
          id: "14",
          name: "Cheesecake de Frutas Vermelhas",
          description: "Cheesecake cremosa com calda de frutas vermelhas",
          price: 28,
          preparationTime: "10 min",
          isVegetarian: true
        },
        {
          id: "15",
          name: "Cannoli Siciliano",
          description: "Cannoli recheado com ricota e gotas de chocolate",
          price: 26,
          preparationTime: "10 min",
          isVegetarian: true
        }
      ]
    }
  ];

  const addToCart = (item: MenuItem) => {
    setSelectedItem(item);
    setItemObservation("");
  };

  const confirmAddToCart = () => {
    if (!selectedItem) return;

    const existingItemIndex = cart.findIndex(
      cartItem => cartItem.item.id === selectedItem.id
    );

    if (existingItemIndex >= 0) {
      const newCart = [...cart];
      newCart[existingItemIndex].quantity += 1;
      newCart[existingItemIndex].observations = itemObservation || newCart[existingItemIndex].observations;
      setCart(newCart);
    } else {
      setCart([...cart, { item: selectedItem, quantity: 1, observations: itemObservation }]);
    }

    setSelectedItem(null);
    setItemObservation("");
  };

  const removeFromCart = (index: number) => {
    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);
  };

  const updateQuantity = (index: number, delta: number) => {
    const newCart = [...cart];
    const newQuantity = newCart[index].quantity + delta;
    
    if (newQuantity <= 0) {
      removeFromCart(index);
    } else {
      newCart[index].quantity = newQuantity;
      setCart(newCart);
    }
  };

  const totalPrice = cart.reduce((sum, item) => sum + (item.item.price * item.quantity), 0);

  const renderDietaryIcons = (item: MenuItem) => (
    <div className="flex gap-2 mt-2">
      {item.isVegetarian && (
        <span className="text-green-500 text-sm bg-green-500/10 px-2 py-1 rounded">
          Vegetariano
        </span>
      )}
      {item.isGlutenFree && (
        <span className="text-blue-500 text-sm bg-blue-500/10 px-2 py-1 rounded">
          Sem Glúten
        </span>
      )}
      {item.spicyLevel && (
        <span className="text-red-500 text-sm bg-red-500/10 px-2 py-1 rounded">
          {Array(item.spicyLevel).fill('🌶️').join('')}
        </span>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      {/* Hero Section */}
      <div 
        className="h-[40vh] bg-cover bg-center relative"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80")'
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center">
          <h1 className="text-5xl font-serif mb-2">Pizzaria Bella Napoli</h1>
          <p className="text-xl italic">Sabor autêntico, paixão em cada fatia</p>
        </div>
      </div>

      {/* Menu Navigation */}
      <div className="bg-[#2a2a2a] sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4">
          <nav className="flex overflow-x-auto py-4 gap-8">
            {menuSections.map((section, index) => (
              <button
                key={section.title}
                onClick={() => setActiveCategory(index)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors whitespace-nowrap
                  ${activeCategory === index 
                    ? 'bg-red-700 text-white' 
                    : 'text-gray-400 hover:text-white'}`}
              >
                {section.icon}
                {section.title}
              </button>
            ))}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-700 text-white ml-auto"
            >
              <ShoppingCart className="w-6 h-6" />
              <span className="font-semibold">{cart.length}</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Menu Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid gap-8">
          {menuSections[activeCategory].items.map((item) => (
            <div 
              key={item.id}
              className="bg-[#2a2a2a] p-6 rounded-lg hover:bg-[#333333] transition-colors"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
                  <p className="text-gray-400">{item.description}</p>
                  {renderDietaryIcons(item)}
                  {item.preparationTime && (
                    <div className="flex items-center gap-1 text-gray-400 mt-2">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{item.preparationTime}</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="text-red-500 font-semibold">{formatPrice(item.price)}</span>
                  <button
                    onClick={() => addToCart(item)}
                    className="bg-red-700 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-colors"
                  >
                    Adicionar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Shopping Cart Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#2a2a2a] p-8 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Seu Pedido</h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {cart.length === 0 ? (
              <p className="text-gray-400 text-center py-8">Seu carrinho está vazio</p>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  {cart.map((cartItem, index) => (
                    <div key={index} className="flex items-start justify-between bg-[#333333] p-4 rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold">{cartItem.item.name}</h3>
                        {cartItem.observations && (
                          <p className="text-sm text-gray-400 mt-1">Obs: {cartItem.observations}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(index, -1)}
                            className="text-gray-400 hover:text-white"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center">{cartItem.quantity}</span>
                          <button
                            onClick={() => updateQuantity(index, 1)}
                            className="text-gray-400 hover:text-white"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <span className="text-red-500 font-semibold min-w-[80px] text-right">
                          {formatPrice(cartItem.item.price * cartItem.quantity)}
                        </span>
                        <button
                          onClick={() => removeFromCart(index)}
                          className="text-gray-400 hover:text-white"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-700 pt-4">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-xl font-semibold">Total</span>
                    <span className="text-xl text-red-500 font-semibold">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      alert('Pedido finalizado! Total: ' + formatPrice(totalPrice));
                      setCart([]);
                      setIsCartOpen(false);
                    }}
                    className="w-full bg-red-700 text-white py-3 rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Finalizar Pedido
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Add to Cart Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#2a2a2a] p-8 rounded-lg max-w-md w-full">
            <h2 className="text-2xl font-semibold mb-4">{selectedItem.name}</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Observações (opcional)
              </label>
              <textarea
                value={itemObservation}
                onChange={(e) => setItemObservation(e.target.value)}
                placeholder="Ex: Sem cebola, bem passada..."
                className="w-full bg-[#333333] text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                rows={3}
              />
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setSelectedItem(null)}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-600 text-gray-400 hover:bg-gray-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmAddToCart}
                className="flex-1 px-4 py-2 rounded-lg bg-red-700 text-white hover:bg-red-600 transition-colors"
              >
                Adicionar ao Carrinho
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-[#2a2a2a] py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-400">
          <p className="mb-2">Rua das Pizzas, 123 - Centro</p>
          <p className="mb-4">Tel: (11) 99999-9999</p>
          <p className="italic">"A verdadeira pizza napolitana, aqui no Brasil"</p>
        </div>
      </footer>
    </div>
  );
}

export default App;