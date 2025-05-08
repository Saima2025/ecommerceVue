<script setup>
import FooterComponent from '../components/Footer.vue'
</script>

<template>
    <main >
        <!-- ref="addProd" -->
        <div class='py-20 px-4'>
            <div class='text-white max-w-6xl mx-auto py-2'>
                <div class='grid md:grid-cols-2 gap-20 grid-cols-1'>
                    <div class=''>
                        <div class="relative" v-if="product.image_urls && product.image_urls.length">
                            <img :src="product.image_urls[currentImg]" alt="no image" @error="onImageError"
                            />
                            <div class="absolute bottom-0 right-0 p-4 flex flex-nowrap gap-4">
                                <div
                                    v-for="(img, i) in product.image_urls"
                                    :key="i"
                                    class="flex w-full flex-nowrap gap-4 rounded-lg"
                                >
                                    <div @click="currentImg = i" :title="img" class="w-16 h-24 flex-none">
                                        <div class="h-full w-full rounded-lg cursor-pointer shadow-lg border overflow-hidden">
                                            <img :src="img" alt="" class="h-full w-full">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div class=''>
                        <div class='flex md:flex-col flex-col space-y-7 justify-center'>
                            <div class='text-black space-y-3'>
                                <h2 class='font-bold text-xl text-black'>{{product.title}}</h2>
                                <p class='text-sm'>{{product.description}}</p>
                            </div>

                            <div class='space-y-3'>
                                <div class='font-bold text-md text-black'>Shop</div>
                                <div class='flex flex-row flex-wrap gap-4'>
                                    <span class=' text-black text-sm'>{{product.shop_id}}</span>
                                    <span class=' text-black text-sm'>{{product.shop_name}}</span>
                                </div>
                                <div  class='border-2 rounded-md cursor-pointer flex justify-center py-3 px-5'>
                                    <span class=' text-black text-sm'>{{product.genre_name}}</span>
                                </div>
                                <div  class='border-2 rounded-md cursor-pointer flex justify-center py-3 px-5'>
                                    <span class=' text-black text-sm'>{{product.genre_id}}</span>
                                </div>
                                <div  class='border-2 rounded-md cursor-pointer flex justify-center py-3 px-5'>
                                    <span class=' text-black text-sm'>{{product.brand}}</span>
                                </div>                              
                            </div>

                            <div class='flex flex-col space-y-3'>
                                <div>
                                    <span class='text-gray-700 text-2xl font-san'>&yen;{{ product.price }}</span>
                                </div>

                                <!-- <div @click="addProduct()" class='bg-gray-900 cursor-pointer text-white w-full text-sm font-semibold py-3 flex justify-center cursor pointer hover:bg-white hover:border hover:border-gray-900 hover:text-black '>
                                    ADD TO CART
                                </div> -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <footer-component/>
    </main>
</template>

<script>
import { apiHeader } from '../services/api' // adjust path to where you defined apiHeader
// import axios from 'axios'

export default {
    activated() {
        window.scrollTo(0, 0);
    },
    data(){
        return{
            currentImg : 0,
            productData:[],
            product:{
            },
            productId:'',
        }
    },
    mounted(){
        window.scrollTo(0, 0);
    },
    beforeMount(){
        this.productId = this.$route.params.id.toString() ;
        this.platform = this.$route.params.platform.toString() ;

        apiHeader().get(`/items/${this.platform}/${this.productId}`)
        .then(response => {
          this.product = response.data.item;
          console.log(this.fetchData)
        })
        .catch(error => {
          const backendMessage = error.response?.data?.detail || "Something went wrong";
          console.error("Error:", backendMessage);
          alert(backendMessage);
          this.product = {id:2,title:'shirt',description:'Artisan',shop_id:'gfdsg',shope_name:'hfgh',genre_id:543,genre_name:"sgdfsg",
            brand:"ewrt",price:2000
          }

        })
    },
    methods:{
        onImageError(event) {
            event.target.src = '../assets/hoodie.png'; // Replace with your fallback image path
        }
        // addProduct(){
        //     this.$emit('addP',this.variants_id)
        // }
    }
}
</script>