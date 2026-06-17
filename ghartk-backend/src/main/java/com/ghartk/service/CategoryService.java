package com.ghartk.service;

import com.ghartk.dto.request.CategoryRequest;
import com.ghartk.dto.response.CategoryResponse;
import com.ghartk.entity.Category;
import com.ghartk.exception.BadRequestException;
import com.ghartk.exception.ResourceNotFoundException;
import com.ghartk.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CategoryService {
    private final CategoryRepository categoryRepository;

    public List<CategoryResponse> getAllActiveCategories() {
        return categoryRepository.findByIsActiveTrueOrderBySortOrderAsc()
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll().stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional
    public CategoryResponse createCategory(CategoryRequest request) {
        if (categoryRepository.existsByName(request.getName()))
            throw new BadRequestException("Category '" + request.getName() + "' already exists");
        Category category = Category.builder()
                .name(request.getName()).description(request.getDescription())
                .imageUrl(request.getImageUrl()).iconEmoji(request.getIconEmoji())
                .isActive(request.isActive()).sortOrder(request.getSortOrder()).build();
        return mapToResponse(categoryRepository.save(category));
    }

    @Transactional
    public CategoryResponse updateCategory(Long id, CategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category", id));
        category.setName(request.getName()); category.setDescription(request.getDescription());
        category.setImageUrl(request.getImageUrl()); category.setIconEmoji(request.getIconEmoji());
        category.setActive(request.isActive()); category.setSortOrder(request.getSortOrder());
        return mapToResponse(categoryRepository.save(category));
    }

    @Transactional
    public void deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) throw new ResourceNotFoundException("Category", id);
        categoryRepository.deleteById(id);
    }

    private CategoryResponse mapToResponse(Category c) {
        return CategoryResponse.builder()
                .id(c.getId()).name(c.getName()).description(c.getDescription())
                .imageUrl(c.getImageUrl()).iconEmoji(c.getIconEmoji())
                .isActive(c.isActive()).sortOrder(c.getSortOrder())
                .productCount(c.getProducts().size()).build();
    }
}
