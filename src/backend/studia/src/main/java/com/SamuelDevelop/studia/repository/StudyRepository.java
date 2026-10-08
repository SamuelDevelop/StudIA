package com.SamuelDevelop.studia.repository;

import com.SamuelDevelop.studia.entity.Study;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface StudyRepository extends JpaRepository<Study, UUID> {
    List<Study> findAllByUserIdOrderByCreatedAtDesc(UUID userId);

    Optional<Study> findByIdAndUserId(UUID id, UUID userId);

    boolean existsByIdAndUserId(UUID id, UUID userId);

    void deleteByIdAndUserId(UUID id, UUID userId);
}

