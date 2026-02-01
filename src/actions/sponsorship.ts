// 실질적인 컨트롤러

'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export type ActionState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

export async function saveSponsorship(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();

  // 1. 데이터 추출
  const sponsorshipId = formData.get('id') as string; // 수정 시 사용
  const actionType = formData.get('actionType') as string; // 'new' | 'edit'
  
  const title = formData.get('title') as string;
  const brandName = formData.get('brand') as string;
  const contentType = formData.get('contentType') as string;
  const status = formData.get('status') as string;
  
  // 날짜/숫자 데이터 처리 (빈 문자열이면 null로 처리)
  const receivedDate = formData.get('receivedDate') ? String(formData.get('receivedDate')) : null;
  const uploadDeadline = formData.get('uploadDeadline') ? String(formData.get('uploadDeadline')) : null;
  const deadlineDays = formData.get('uploadPeriodDays') ? Number(formData.get('uploadPeriodDays')) : null;
  const retentionMonths = formData.get('contentRetentionMonths') ? Number(formData.get('contentRetentionMonths')) : null;

  // 2. 이미지 업로드 처리
  const imageFile = formData.get('image') as File;
  let imageUrl = formData.get('existingImageUrl') as string | null; // 기존 이미지 유지

  if (imageFile && imageFile.size > 0) {
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('sponsorship-images')
      .upload(fileName, imageFile);

    if (uploadError) {
      return { success: false, message: '이미지 업로드 실패: ' + uploadError.message };
    }

    const { data: urlData } = supabase.storage
      .from('sponsorship-images')
      .getPublicUrl(uploadData.path);

    imageUrl = urlData.publicUrl;
  }

  // 3. DB 저장 데이터 매핑 (Snake Case 변환)
  const dbData = {
    title,
    brand_name: brandName,
    image_url: imageUrl,
    content_type: contentType,
    status: status,
    guide_url: formData.get('guideLink') as string,
    purchase_url: formData.get('purchaseLink') as string,
    received_date: receivedDate,
    upload_deadline: uploadDeadline,
    deadline_days: deadlineDays,
    retention_months: retentionMonths,
    memo: formData.get('comment') as string,
    description: formData.get('description') as string,
  };

  let error;

  if (actionType === 'edit' && sponsorshipId) {
    // 업데이트
    const { error: updateError } = await supabase
      .from('sponsorships')
      .update(dbData)
      .eq('id', sponsorshipId);
    error = updateError;
  } else {
    // 신규 생성
    const { error: insertError } = await supabase
      .from('sponsorships')
      .insert(dbData);
    error = insertError;
  }

  if (error) {
    console.error('Database Error:', error);
    return { success: false, message: 'DB 저장에 실패했습니다.' };
  }

  // 4. 캐시 갱신 (목록 페이지 새로고침 효과)
  revalidatePath('/sponsorship'); 

  return { success: true, message: '성공적으로 저장되었습니다.' };
}