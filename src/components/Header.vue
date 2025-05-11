<template>
    <div class="bg-black">
        <div class="fixed z-50 bg-white w-full top-0 p-3 md:bg-opacity-0">
            <div class="max-w-6xl relative flex mx-auto flex-col md:flex-row">
                <a href="" class="md:hidden absolute top-1 right-14">
                    <div class="relative">
                        <img src="/icon.png" class="bottom-1 cursor-pointer relative">
                        <div class="absolute px-1  bg-red-500 -top-1 -right-1 rounded-full border-2 border-white text-white" id="cart2" style="font-size: 10px"></div>
                    </div>
                </a>
                <div class="absolute h-10 flex justify-center bars items-center w-10 text-white right-1 -top-2 rounded-lg shadow-lg md:hidden cursor-pointer border-2 border-white bg-red-500">
                    <i class="fa fa-bars"></i>
                </div>
                <div class="flex-grow font-bold text-lg">
                    <router-link :to="{ name: 'home'}" >
                        <span class="">Saima's Shop</span>
                    </router-link>
                </div>
                <div class="menu hidden md:flex flex-col md:flex-row mt-5 md:mt-0 gap-16">
                    <div class="flex flex-col md:flex-row gap-12 capitalize">
                        <div class="">
                            <router-link :to="{ name: 'home'}" >
                                <span class="text-red-400 font-bold border-b border-red-400">home</span>
                            </router-link>
                        </div>
                        <div class="">
                            <router-link :to="{ name: 'products'}" >
                                <span  class="text-red-400 font-bold border-b border-red-400">products</span>
                            </router-link>
                        </div>

                    </div>
                    <div class="flex gap-12">
                        <a href="#" class="hidden md:block">
                            <div class="relative">
                                <img src="/icon.png" class="bottom-1 cursor-pointer relative">
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
}
</script>
<style>
</style>