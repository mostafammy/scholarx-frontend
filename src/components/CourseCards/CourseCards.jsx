import './CourseCards.css';

function CourseCards({ course }) {
  return (
    <div className="course-card">
      <h2 className="course-title">{course.title}</h2>
      <p className="course-description">{course.description.slice(0, 100)}...</p>
      <p className="course-category">
        <span className="category-label">الكاتيجوري:</span> {course.categoryId?.name || 'غير معروف'}
      </p>
      <p className="course-price">السعر: {course.currentPrice} جنيه</p>
    </div>
  );
}

export default CourseCards;