<template>
    <div class="flex flex-col md:flex-row gap-4">
      <!-- Search Input -->
       <div class="w-full" v-if="localFilter == 'shopCode' || localFilter == 'shipArea' || localFilter == ''">
            <input
                type="text"
                v-model="localSearch"
                @input="$emit('update:searchQuery', localSearch)"
                placeholder="Search products..."
                class="border px-4 py-2 rounded-md w-full"
             />
       </div>
       <div class="w-full" v-if="localFilter == 'sort'">
        <select
            v-model="localSearch"
            @change="$emit('update:searchQuery', localSearch)"
             class="border px-4 py-2 rounded-md w-full"
         >
            <option disabled value="">Filter By</option>
            <option value="standard">Standard</option>
            <option value="reviewCount">Review Count</option>
            <option value="reviewAvg">Review Average</option>
            <option value="price">Price</option>
        </select>
       </div>
       <div class="w-1/3" v-if="localFilter == 'sort'">
        <select
            v-model="localOrder"
             @change="$emit('update:orderBy', localOrder)"
            class="border px-4 py-2 rounded-md w-full"
         >
            <option disabled value="">Order By</option>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
        </select>
       </div>
       <div class="w-full" v-if="localFilter == 'genreId' || localFilter == 'page' || localFilter == 'brandId'
       || localFilter == 'sellerId' || localFilter == 'delDay'">
            <input
                type="number"
                v-model.number="localSearch"
                @input="$emit('update:searchQuery', localSearch)"
                placeholder="Enter a number"
                class="border px-4 py-2 rounded-md w-full"
            />
       </div>
       <div class="w-full" v-if="localFilter == 'condition' || localFilter == 'imageFlag' || localFilter == 'shipFlag' || localFilter == 'inStock'
       || localFilter == 'isDiscounted' ">
            <select
                v-model.number="localSearch"
                @change="$emit('update:searchQuery', localSearch)"
                class="border px-4 py-2 rounded-md w-full"
                >
                <option :value=1>True</option>
                <option :value=0>False</option>
            </select>
       </div>
       <div class="w-full" v-if="localFilter == 'delDeadline'">
            <input
                type="number"
                v-model.number="localSearch"
                @input="handleInput"
                :min="1"
                :max="24"
                placeholder="Enter a number(1-24)"
                class="border px-4 py-2 rounded-md w-full"
            />
       </div>
       <div class="w-1/3" v-if="localFilter == 'sort' && localSearch == 'price'">
            <input
                type="number"
                v-model.number="localPriceFrom"
                @input="$emit('update:priceFrom', localPriceFrom)"
                placeholder="Enter a price"
                class="border px-4 py-2 rounded-md w-full"
            />
       </div>
       <div class="w-1/3" v-if="localFilter == 'sort' && localSearch == 'price'">
            <input
                type="number"
                v-model.number="localPriceTo"
                @input="$emit('update:priceTo', localPriceTo)"
                placeholder="Enter a price"
                class="border px-4 py-2 rounded-md w-full"
            />
       </div>
       <div class="w-full" v-if="localFilter == 'delArea'">
            <input
             v-model="localSearch"
            @input="validateDeliveryArea"
            maxlength="2"
            placeholder="Enter area code (01–47)"
            class="border px-3 py-2 rounded-md w-full"
            />
       </div>
       <div class="w-full" v-if="localFilter == 'shipping' ">
            <select
                v-model="localSearch"
                @change="$emit('update:searchQuery', localSearch)"
                class="border px-4 py-2 rounded-md w-full"
                >
                <option :value=1>No setting</option>
                <option :value=2>Free shipping </option>
                <option :value=3>Conditional free shipping</option>
            </select>
       </div>
  
      <!-- Filter Dropdown -->
      <select
        v-model="localFilter"
        @change="resetSearchKeyword"
        class="border px-4 py-2 rounded-md w-full md:w-60"
      >
        <option disabled value="">Filter By</option>
        <option value="sort">Sort</option>
        <option value="shopCode">Shop Code</option>
        <option value="genreId">Genre Id</option>
        <option value="condition">Condition</option>
        <option value="imageFlag">Image Flag</option>
        <option value="shipFlag">Ship Overseas Flag</option>
        <option value="shipArea">Ship Overseas Area</option>
        <option value="brandId">Brand Id</option>
        <option value="sellerId">Seller Id</option>
        <option value="inStock">In Stock</option>
        <option value="isDiscounted">Is Discounted</option>
        <option value="shipping">Shipping</option>
        <option value="delArea">Delivery Area</option>
        <option value="delDay">Delivery Day</option>
        <option value="delDeadline">Delivery Deadline</option>
      </select>
    </div>
  </template>
  
  <script>

  export default {
    props: {
      searchQuery: String,
      selectedFilter: String,
      priceFrom: Number,
      priceTo: Number,
      orderBy: String
    },
    data() {
      return {
        localSearch: this.searchQuery,
        localFilter: this.selectedFilter,
        localPriceFrom: this.priceFrom,
        localPriceTo: this.priceTo,
        localOrder: this.orderBy
      }
    },
    watch: {
      searchQuery(newVal) {
        this.localSearch = newVal;
      },
      selectedFilter(newVal) {
        this.localFilter = newVal;
      },
      priceFrom(newVal) {
        this.localpriceFrom = newVal;
      },
      priceTo(newVal){
        this.localPriceTo = newVal;
      },
      localOrder(newVal) {
        this.localOrder = newVal
      }
    },
    mounted() {
        this.localFilter = ''
    },
    methods: {
      // Delivery deadline filter validation 
        handleInput(event) {
            this.validateRange(event);
            this.$emit('update:searchQuery', this.localSearch);
        },
        validateRange(event) {
            const val = Number(event.target.value);
            if (val < 1 || val > 24) {
            this.localSearch = null;
            event.target.value = '';
            alert("Please enter from 1 to 24 only.");
            }
        },
        // Delivery area filter validation
        validateDeliveryArea() {
            // Only digits allowed
            if (!/^\d{0,2}$/.test(this.localSearch)) {
                this.localSearch = this.localSearch.replace(/\D/g, '');
            }
            // Check if in valid range
            const num = parseInt(this.localSearch, 10);
            if ((num < 1 || num > 47)) {
                alert('Enter a value between 01 and 47.');
                this.localSearch = null
            } 
            this.$emit('update:searchQuery', this.localSearch);
       },
       resetSearchKeyword() {
        this.localSearch = null;
        this.$emit('update:selectedFilter',this.localFilter)
       }
    }
  }
  </script>