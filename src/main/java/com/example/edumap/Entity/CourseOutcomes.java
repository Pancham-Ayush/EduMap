package com.example.edumap.Entity;

import com.example.edumap.Entity.Enum.ProgramOutcome_Constants;

import java.util.*;

public class CourseOutcomes {
    private Long id;
    private Long courseId;
    private String description;
    EnumMap<ProgramOutcome_Constants,ProgramOutcomes> outcomes =  new EnumMap<>(ProgramOutcome_Constants.class);
}
