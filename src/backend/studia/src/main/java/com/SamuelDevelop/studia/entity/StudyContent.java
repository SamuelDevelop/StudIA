package com.SamuelDevelop.studia.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "study_contents")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudyContent {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "study_id", nullable = false)
    private Study study;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String introduction;

    @OneToMany(mappedBy = "content", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("orderIndex ASC")
    @Builder.Default
    private List<StudySection> sections = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "study_key_points", joinColumns = @JoinColumn(name = "content_id"))
    @Column(name = "key_point", columnDefinition = "TEXT")
    @Builder.Default
    private List<String> keyPoints = new ArrayList<>();

    @Column(nullable = false, columnDefinition = "TEXT")
    private String conclusion;
}
