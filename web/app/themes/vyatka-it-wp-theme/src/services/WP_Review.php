<?php

namespace App\Services;

class WP_Review
{
    private array $errors = [];

    public function add()
    {
        if ($this->validate()) {
            $review_id = wp_insert_comment([
                'comment_post_ID' => 1,
                'comment_author' => $_POST['name'],
                'comment_type' => 'comment',
                'comment_author_email' => $_POST['email'],
                'comment_content' => $_POST['review'],
                'comment_approved' => 0
            ]);
            $review_object = get_comment($review_id);

            update_field('review_phone', $_POST['phone'], $review_object);
            update_field('review_rating', $_POST['rating'], $review_object);

            return [
                'success' => 'true',
            ];
        } else {
            return [
                    'errors' => $this->errors
                ];
        }
    }

    static function get(): array
    {
        $reviews = [];
        $comments = get_comments();

        foreach ($comments as $comment) {
            $oldDate = $comment->comment_date;
            $date = date('d.m.Y', strtotime($oldDate));
            $reviews[] = [
                'ID' => $comment->comment_ID,
                'name' => $comment->comment_author,
                'date' => $date,
                'text' => $comment->comment_content,
                'is_approved' => $comment->comment_approved,
                'rating' =>get_field('review_rating', $comment),
            ];
        }

        return $reviews;
    }

    private function validate()
    {
        if (empty($_POST['name'])) {
            $this->errors['name'] = 'Укажите имя';
        }

        if (empty($_POST['phone'])) {
            $this->errors['phone'] = 'Укажите телефон';
        }

        if (empty($_POST['term'])) {
            $this->errors['term'] = 'Вы не дали согласие';
        }

        return empty($this->errors);
    }
}
