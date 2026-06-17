package com.ghartk.service;

import com.ghartk.dto.request.ProductRequest;
import com.ghartk.dto.response.ProductResponse;
import com.ghartk.entity.Category;
import com.ghartk.entity.Product;
import com.ghartk.exception.ResourceNotFoundException;
import com.ghartk.repository.CategoryRepository;
import com.ghartk.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductService {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public Page<ProductResponse> getProducts(Long categoryId, String query, int page, int size, String sortBy) {
        Sort sort = switch (sortBy != null ? sortBy : "") {
            case "price_asc" -> Sort.by("price").ascending();
            case "price_desc" -> Sort.by("price").descending();
            case "rating" -> Sort.by("rating").descending();
            default -> Sort.by("createdAt").descending();
        };
        Pageable pageable = PageRequest.of(page, size, sort);
        String q = (query != null && !query.trim().isEmpty()) ? query.trim() : null;
        return productRepository.findWithFilters(categoryId, q, pageable).map(this::mapToResponse);
    }

    public ProductResponse getProductById(Long id) {
        return mapToResponse(productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", id)));
    }

    public List<ProductResponse> getFeaturedProducts() {
        return productRepository.findByIsFeaturedTrueAndIsAvailableTrue()
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public List<ProductResponse> getLowStockProducts() {
        return productRepository.findByStockQtyLessThanAndIsAvailableTrue(10)
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional
    public ProductResponse createProduct(ProductRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category", request.getCategoryId()));
        Product product = Product.builder()
                .category(category).name(request.getName()).description(request.getDescription())
                .imageUrl(request.getImageUrl()).price(request.getPrice()).mrp(request.getMrp())
                .stockQty(request.getStockQty()).unit(request.getUnit())
                .isAvailable(request.isAvailable()).isFeatured(request.isFeatured())
                .isVeg(request.isVeg()).rating(4.0).reviewCount(0).build();
        return mapToResponse(productRepository.save(product));
    }

    @Transactional
    public ProductResponse updateProduct(Long id, ProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", id));
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category", request.getCategoryId()));
        product.setCategory(category); product.setName(request.getName());
        product.setDescription(request.getDescription()); product.setImageUrl(request.getImageUrl());
        product.setPrice(request.getPrice()); product.setMrp(request.getMrp());
        product.setStockQty(request.getStockQty()); product.setUnit(request.getUnit());
        product.setAvailable(request.isAvailable()); product.setFeatured(request.isFeatured());
        product.setVeg(request.isVeg());
        return mapToResponse(productRepository.save(product));
    }

    @Transactional
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) throw new ResourceNotFoundException("Product", id);
        productRepository.deleteById(id);
    }

    public ProductResponse mapToResponse(Product p) {
        return ProductResponse.builder()
                .id(p.getId()).categoryId(p.getCategory().getId()).categoryName(p.getCategory().getName())
                .name(p.getName()).description(p.getDescription()).imageUrl(p.getImageUrl())
                .price(p.getPrice()).mrp(p.getMrp()).stockQty(p.getStockQty()).unit(p.getUnit())
                .isAvailable(p.isAvailable()).isFeatured(p.isFeatured()).isVeg(p.isVeg())
                .rating(p.getRating()).reviewCount(p.getReviewCount()).createdAt(p.getCreatedAt()).build();
    }
}
