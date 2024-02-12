<script>
  import { Router, Route } from "svelte-navigator";
  import Home from "./pages/home/Home.svelte";
  import Navbar from "./components/navbar/Navbar.svelte";
  import Login from "./pages/login/Login.svelte";
  import VerifyMail from "./pages/login/VerifyMail.svelte";
  import Account from "./pages/account/Account.svelte";
  import CreateProduct from "./pages/product/CreateProduct.svelte";
  import Products from "./pages/product/Products.svelte";
  import ChatBot from "./components/chatbot/ChatBot.svelte";
  import Footer from "./components/footer/Footer.svelte";
  import EditProductModal from "./pages/product/EditProductModal.svelte";
  import Cart from "./pages/cart/Cart.svelte";
  import CartItem from "./pages/cart/CartItem.svelte";
  import Success from "./pages/cart/Success.svelte";
  import Cancel from "./pages/cart/Cancel.svelte";
  import RegisterForm from "./pages/login/RegisterForm.svelte";
</script>

<Router>
  <Navbar/>
  <div class="container mx-auto px-4">
    <Route path="/" component={Login} />
    <Route path="/home" component={Home} />
    <Route path="/register" component={RegisterForm} />
    <Route path="/verify-email" component={VerifyMail} />
    <Route path="/account" component={Account} />
    <Route path="/createProduct" component={CreateProduct} />
    <Route path="/products" component={Products} />
    <Route path="/chatBot" component={ChatBot} />
    <Route path="/edit/:productId" component={EditProductModal}/>
    <Route path="/cart" component={Cart}/>
    <Route path="/cartItem" component={CartItem}/>
    <Route path="/success" component={Success}/>
    <Route path="/cancel" component={Cancel}/>
  </div>
  <Footer/>
</Router>
