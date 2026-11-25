-- Initial lesson catalog aligned to selected Florida B.E.S.T. benchmarks.
-- Standards references:
-- Math: https://www.fldoe.org/academics/standards/subject-areas/math-science/mathematics/
-- K-5 progression: https://www.fldoe.org/file/7576/Math-Standard-Progression-K-5.pdf
-- ELA: https://www.fldoe.org/core/fileparse.php/7539/urlt/elabeststandardsfinal.pdf
-- These are original lesson summaries/activities, not reproduced state curriculum text.
INSERT INTO lessons
  (slug, title, description, grade, subject, strand, benchmark_code, learning_objective, estimated_minutes, sort_order, published)
VALUES
  ('k-counting-sets', 'Star Seed Count-Off', 'Count a group of objects and match the total to a numeral.', 'K', 'math', 'Number Sense and Operations', 'MA.K.NSO.1.1', 'Count up to 20 objects and represent the total with a numeral.', 8, 10, TRUE),
  ('g1-count-sequences', 'Rocket Number Trail', 'Continue a number sequence and practice skip-counting.', '1', 'math', 'Number Sense and Operations', 'MA.1.NSO.1.1', 'Count forward and backward within 120, and skip-count by 2s and 5s within the benchmark ranges.', 10, 10, TRUE),
  ('g2-place-value', 'Hundreds Base Camp', 'Build three-digit numbers with hundreds, tens and ones.', '2', 'math', 'Number Sense and Operations', 'MA.2.NSO.1.1', 'Read and write numbers from 0 to 1,000 in standard, expanded and word forms.', 10, 10, TRUE),
  ('g3-place-value', 'Four-Digit Explorer', 'Represent four-digit numbers in standard, expanded and word forms.', '3', 'math', 'Number Sense and Operations', 'MA.3.NSO.1.1', 'Read and write numbers from 0 to 10,000 in standard, expanded and word forms.', 12, 10, TRUE),
  ('g4-digit-value', 'Place-Value Power Shift', 'Explore how a digit value changes when it moves one place.', '4', 'math', 'Number Sense and Operations', 'MA.4.NSO.1.1', 'Explain how the value of a digit in a multi-digit whole number changes when it moves one place left or right.', 12, 10, TRUE),
  ('g5-decimal-place-value', 'Decimal Mission Control', 'Compare decimal place values through thousandths.', '5', 'math', 'Number Sense and Operations', 'MA.5.NSO.1.1', 'Explain how the value of a digit in a decimal changes when it moves one or more places left or right.', 14, 10, TRUE),
  ('k-initial-sounds', 'Moonbeam Sound Safari', 'Listen for the first sound in familiar spoken words.', 'K', 'ela', 'Foundational Skills - Phonological Awareness', 'ELA.K.F.1.2', 'Identify the initial sound in a spoken word.', 7, 20, TRUE)
ON CONFLICT (slug) DO NOTHING;
