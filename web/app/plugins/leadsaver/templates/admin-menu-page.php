<?php
function leadsaver_admin_menu_page() {
	$ls = new LeadSaver();
    $leads = $ls->get_leads(); ?>
    <div class="wrap">
        <h1><?= get_admin_page_title(); ?></h1>

        <table style="margin-top: 20px;" class="wp-list-table widefat fixed striped table-view-list posts">
            <thead>
            <tr>
                <td class="manage-column column-cb" width="10%">ID</td>
                <td class="manage-column column-cb" width="70%">Контент</td>
                <td class="manage-column column-cb" width="20%">Время</td>
            </tr>
            </thead>
            <tbody id="the-list">
                <? if ($leads) : ?>
                    <? foreach ($leads as $lead) : ?>
                        <tr class="iedit author-self level-0 post-1 type-post status-publish format-standard hentry category-1">
                            <th scope="row" class="author column-author"><label><?= $lead->id ?></label></th>
                            <td class="title column-title has-row-actions column-primary page-title" data-colname="Заголовок">
                                <?= $ls->pretty($lead->data) ?>
                            </td>
                            <td class="author column-author"><?= $lead->time ?></td>
                        </tr>
                    <? endforeach ?>
                <? endif ?>
            </tbody>
        </table>
    </div>
<?php } ?>