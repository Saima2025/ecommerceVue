<template>
  <div>
    <div class="py-28">
      <div class="max-w-6xl mx-auto py-4 space-y-5">
        <div class="flex">
          <div class="flex-grow text-4xl font-extrabold">Special Qualities For You</div>
        </div>
        <!-- search component -->
        <SearchInput
          v-model:searchQuery="searchQuery"
          v-model:selectedFilter="selectedFilter"
          v-model:priceFrom="priceFrom"
          v-model:priceTo="priceTo"
          v-model:orderBy="orderBy"
        />

        <div class="grid gap-20 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 px-3">
          <div v-for="product in fetchData" :key="product.item_id" class="rounded-lg shadow-xl">
            <!-- navigate to product details page -->
            <router-link :to="{ name: 'single-product', params: { id: product?.item_id ,platform: product?.platform}}">
              <div class="bg-white w-full flex justify-center items-center">
                <img src="../assets/hoddie.png" alt="" />
              </div>
              <div class="bg-purple-100 py-8 relative font-bold text-xl w-full flex flex-col justify-center px-6">
                <div>{{ product.title }}</div>
                <div>&yen; {{ product.price }}</div>
              </div>
            </router-link>
          </div>
        </div>
        <PaginationControls
          :currentPage="currentPage"
          :totalPages="totalPages"
          :resultsPerPage="resultsPerPage"
          @update:resultsPerPage="val => { resultsPerPage = val; searchProduct(searchQuery); }"
          @prev-page="prevPage"
          @next-page="nextPage"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { apiHeader } from '../services/api'
import SearchInput from './SearchInput.vue'
import debounce  from  'lodash/debounce'
import PaginationControls from './PaginationControls.vue';

export default {
  components: {
    SearchInput,
    PaginationControls,
  },
  data() {
    return {
      fetchData: [],
      searchQuery: '',
      selectedFilter: '',
      priceFrom: null,
      priceTo: null,
      orderBy:'asc',
      resultsPerPage: 10, // How many items per page
      currentPage: 1,     // Current page index (starts at 0)
      totalResults: 0 ,
      lastSearchKeyword: '', // Store previous search keyword
      initialSearchDone: false, // Flag to know if initial search has been done

    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.totalResults / this.resultsPerPage);
    },
  },
  created() {
    // to run the search api not in every key stroke to wait for 500ms
    this.debouncedSearch = debounce(this.searchProduct, 500);
  },
  mounted() {
    // Call the api when component loads
    this.fetchProducts();
  },
  watch: {
    // to call the api when user filters any of the fields
    searchQuery: {
    handler(newQuery) {
        if (
          (typeof newQuery === 'string' && newQuery.trim() !== '') ||
          (typeof newQuery === 'number' && newQuery !== null && newQuery !== undefined) ||
          typeof newQuery === 'boolean'
        ) {
          this.debouncedSearch(newQuery);
        }
      },
      immediate: true
    },
    priceFrom(){
      this.debouncedSearch('price');
    },
    priceTo(){
      this.debouncedSearch('price');
    },
    orderBy() {
      this.debouncedSearch(this.searchQuery) ;
    },
    selectedFilter() {
      this.fetchData = [],
      this.currentPage= 1;
      this.totalResults= 0;
    },
  },
  methods: {
    // when component loads this api is being called
    fetchProducts() {
      apiHeader().get('/jobs', {
        params: {
          job_name: 'save_data_from_brand',
          job_status: 'success'
        }
      })
      .then(response => {
        this.fetchData = response.data;
        console.log(this.fetchData)
      })
      .catch(error => {
        const backendMessage = error.response?.data?.detail?.response || "Something went wrong"
        console.error("Error:", backendMessage)
        // alert(backendMessage)
        // this.fetchData = [{ item_id: 2, title: 'shirt',price: 1000,platform: 'yahoo' },{item_id:3, title:'pant',price:2000,platform: 'rakuten'}]
      })
    },
    //search api for all filters
    searchProduct(newQuery) {
      if (this.selectedFilter === 'delArea' && this.searchQuery?.length == 1) {
        this.searchQuery = 0 + this.searchQuery
      }
      const startOffset = (this.currentPage - 1) * this.resultsPerPage;
      const isNewSearch = newQuery !== this.lastSearchKeyword;       

      apiHeader().post('/items/search', {
        rakuten_query_parameters: {
          keyword: newQuery,
          ...(!isNewSearch && this.searchQuery && { page: this.currentPage }),
          ...(!isNewSearch && this.searchQuery && { hits: this.resultsPerPage, }),
          ...(this.selectedFilter === "sort" && { sort: this.orderBy == "asc" ? this.getSortValue('rakuten') : `-${this.getSortValue('rakuten')}` }),
          ...(this.selectedFilter === "shopCode" && this.searchQuery && { shopCode: this.searchQuery }),
          ...(this.selectedFilter === "genreId" && this.searchQuery && { genreId: this.searchQuery }),
          ...(this.selectedFilter === "condition" && this.searchQuery && { condition: this.searchQuery }),
          ...(this.selectedFilter === "imageFlag" && this.searchQuery && { imageFlag: this.searchQuery }),
          ...(this.selectedFilter === "shipFlag" && this.searchQuery && { shipOverseasFlag: this.searchQuery }),
          ...(this.selectedFilter === "shipArea" && this.searchQuery && { shipOverseasArea: this.searchQuery })
        },
        yahoo_query_parameters: {
          query: newQuery,
          ...(this.selectedFilter === "genreId" && this.searchQuery && { genre_category_id: this.searchQuery }),
          ...(this.selectedFilter === "brandId" && this.searchQuery && { brand_id: this.searchQuery }),
          ...(this.selectedFilter === "sellerId" && this.searchQuery && { seller_id: this.searchQuery }),
          ...(this.selectedFilter === "sort" && this.searchQuery === "price" && this.priceFrom && { price_from: this.priceFrom }),
          ...(this.selectedFilter === "sort" && this.searchQuery === "price" && this.priceTo && { price_to: this.priceTo }),
          ...(this.selectedFilter === "inStock" && { in_stock: this.searchQuery }),
          ...(this.selectedFilter === "isDiscounted" && { is_discounted: this.searchQuery }),
          ...(this.selectedFilter === "shipping" && { shipping: this.searchQuery }),
          ...(this.selectedFilter === "sort" && { sort: this.orderBy == "asc" ? this.getSortValue('yahoo') : `-${this.getSortValue('yahoo')}` }),
          ...(this.selectedFilter === "condition" && { condition: this.searchQuery }),
          ...(this.selectedFilter === "delArea" && { delivery_area: this.searchQuery}),
          ...(this.selectedFilter === "delDay" && { delivery_day: this.searchQuery }),
          ...(this.selectedFilter === "delDeadline" && { delivery_deadline: this.searchQuery }),

          ...(!isNewSearch && this.searchQuery && { results: this.resultsPerPage }),
          ...(!isNewSearch && this.searchQuery && { start:  startOffset }),
        },
        from_scheduler: false
      })
      .then(response => {
        this.fetchData = response.data.result;
        
         // Only set total count on initial search
      if (isNewSearch) {
        this.totalResults = response.data?.result?.length || 0;
        this.lastSearchKeyword = newQuery;
        this.currentPage = 1;
      }
        this.initialSearchDone = true;
        // api call to save the search keyword 
        this.saveSearchKeyword() ;
      })
      .catch(error => {
        const backendMessage = error.response?.data?.response || "Something went wrong"
        console.error("Error:", backendMessage)
        alert(backendMessage)
      })
    },
    // get sort value for api payload
    getSortValue(platform) {
      console.log(this.searchQuery) ;
      if(platform == "rakuten") {
        switch (this.searchQuery) {
        case 'standard':
          return 'standard'
        case 'reviewCount':
          return 'reviewCount'
        case 'reviewAvg':
          return 'reviewAverage'
        case 'price':
          return 'itemPrice'
        default:
          return 'standard'
        }
      } else {
        switch (this.searchQuery) {
          case 'standard':
            return 'score'
          case 'reviewCount':
            return 'review_count'
          case 'reviewAvg':
            return 'review_average'
          case 'price':
            return 'price'
          default:
            return 'score'
        }
      }
    },
    //api call to save the search keyword 
    saveSearchKeyword() {
      apiHeader().post('/search/save-keywords', {
        keyword: this.searchQuery.toString()
      })
      .then(response => {
       console.log(response) ;
      })
      .catch(error => {
        const backendMessage = error.response?.data?.detail || "Something went wrong";
        console.error("Error:", backendMessage)
        // alert(backendMessage)
      })
    },
     prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.searchProduct(this.lastSearchKeyword);
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.searchProduct(this.lastSearchKeyword);
      }
    },
  }
}
</script>

<style scoped>
.search-box {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
}
</style>