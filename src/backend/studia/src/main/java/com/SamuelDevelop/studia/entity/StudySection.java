package com.SamuelDevelop.studia.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "study_sections")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudySection {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "content_id", nullable = false)
    private StudyContent content;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String body;

    @Column(name = "order_index", nullable = false)
    private Integer orderIndex;
}

