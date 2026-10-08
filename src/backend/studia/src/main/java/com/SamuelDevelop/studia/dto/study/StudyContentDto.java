package com.SamuelDevelop.studia.dto.study;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudyContentDto {
    private String introduction;
    @Builder.Default
    private List<StudySectionDto> sections = new ArrayList<>();
    @Builder.Default
    private List<String> keyPoints = new ArrayList<>();
    private String conclusion;
}

